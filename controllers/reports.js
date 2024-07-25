const {Reports, ReportHistory} = require('../model/reports');
const User = require('../model/users')

// Get reports by user's ID with search, sort, and pagination
exports.getReportsByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { search, sortBy, sortOrder, page, limit } = req.query;

        let query = { User: userId };
        
        // Search functionality
        if (search) {
            query = {
                ...query,
                $or: [
                    { title: { $regex: search, $options: 'i' } }, // Case-insensitive search for title
                    { description: { $regex: search, $options: 'i' } }, // Case-insensitive search for description
                ],
            };
        }

        // Sorting functionality
        let sortQuery = {};
        if (sortBy) {
            sortQuery[sortBy] = sortOrder === 'desc' ? -1 : 1;
        }

        // Pagination functionality
        const pageNumber = parseInt(page) || 1;
        const pageSize = parseInt(limit) || 10;
        const skip = (pageNumber - 1) * pageSize;

        const reports = await Reports.find(query)
            .sort(sortQuery)
            .skip(skip)
            .limit(pageSize);

        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get report by report id
exports.getReportsByReportId = async (req, res) => {
    try {
        const reportId = req.params.reportId;
        const report = await Reports.findById(reportId);
  
      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }
  
        // Fetch update history for the report
        const updateHistory = await ReportHistory.find({ reportId });
        const bugDetails = {
            ...report._doc,
            updateHistory: updateHistory
        }

        res.status(200).json(bugDetails);
} catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };

// Get all reports with search, sort, and pagination
exports.getAllReports = async (req, res) => {
    try {
        const { search, sortBy, sortOrder, page, limit } = req.query;

        let query = {};

        // Search functionality
        if (search) {
            query = {
                ...query,
                $or: [
                    { title: { $regex: search, $options: 'i' } } // Case-insensitive search for title
                ],
            };
        }

        // Sorting functionality
        let sortQuery = {};
        if (sortBy) {
            // Map severity levels to numerical values for sorting
            const severityMap = {
                'high': 1,
                'medium': 0,
                'low': -1
            };
            sortQuery[sortBy] = severityMap[sortBy];

            // If sorting by severity, use the numerical values for sorting
            if (sortBy === 'severity') {
                sortQuery[sortBy] *= sortOrder === 'desc' ? 1 : -1;
            }
        }

        // Pagination functionality
        const pageNumber = parseInt(page) || 1;
        const pageSize = parseInt(limit) || 10;
        const skip = (pageNumber - 1) * pageSize;

        const allReports = await Reports.find(query)
            .sort(sortQuery)
            .skip(skip)
            .limit(pageSize);

        res.status(200).json(allReports);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching reports' });
    }
};

// Create a new report
exports.createReport = async (req, res) => {
    try {
        const { User, title, description, fileAttached } = req.body;
        const report = await Reports.create({ User, title, description, fileAttached });
        res.status(201).json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//update an existing report
exports.updateReport = async (req, res) => {
    try {
        const userId = req.cookies.userId
        const reportId = req.params.reportId;
        const updateData = req.body;

        // Find the report by ID
        let report = await Reports.findById(reportId);

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // Save a copy of the previous report data, excluding _id
        const previousData = { ...report.toObject(), _id: undefined };

        // Fetch the username corresponding to the userId from the previous data
        const user = await User.findById(userId);
        const username = user.name ; 
        // Save previous report data to report history
        const reportHistory = new ReportHistory({
            reportId,
            previousData,
            updatedBy: username, // Use the fetched username
            updatedAt: new Date()
        });
        await reportHistory.save();

        // Update the report with the new data
        report = await Reports.findByIdAndUpdate(reportId, updateData, {
            new: true,
            runValidators: true,
        });

        // Save the modified report back to the database
        await report.save();

        res.status(200).json(report);
    } catch (error) {
        console.error('Error updating report:', error);
        res.status(500).json({ error: error.message });
    }
};

//get history of a specific report
exports.reportHistory =  async (req, res) => {
    try {
        const reportId = req.params.reportId;

        // Query the database to fetch report history by report ID
        const reportHistory = await ReportHistory.find({ reportId });

        // Check if report history exists
        if (!reportHistory) {
            return res.status(404).json({ message: 'Report history not found' });
        }

        // Send the report history data as a response
        res.status(200).json(reportHistory);
    } catch (error) {
        console.error('Error fetching report history:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Revert to a specific version of the report
exports.revertToVersion = async (req, res) => {
    try {
        const { reportId, updateId } = req.params;

        // Find the report by ID
        const report = await Reports.findById(reportId);

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // Find the update in the update history
        const update = await ReportHistory.findById(updateId);

        if (!update) {
            return res.status(404).json({ message: 'Update not found' });
        }

        // Save a copy of the current report data, excluding _id
        const previousData = { ...report.toObject(), _id: undefined };

        // Save the current report data to report history
        const reportHistory = new ReportHistory({
            reportId,
            previousData,
            updatedBy: req.cookies.userId,
            updatedAt: new Date()
        });
        await reportHistory.save();

        // Revert to the selected version
        report.title = update.title;
        report.description = update.description;
        report.fileAttached = update.fileAttached;
        report.severity = update.severity;
        report.assignedTo = update.assignedTo;
        report.status = update.status;
        report.remark = update.remark;

        // Save the reverted report
        await report.save();

        res.json({ message: 'Report reverted to selected version', report });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
