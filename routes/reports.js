const express = require('express');
const router = express.Router();
const { getReportsByUserId, getAllReports, createReport, updateReport, getReportsByReportId, revertToVersion, reportHistory } = require('../controllers/reports');

router.get('/:userId', getReportsByUserId);

router.get('/bug/:reportId', getReportsByReportId);

router.get('/', getAllReports);

router.post('/bug', createReport);

router.put('/:reportId', updateReport);

router.get('/bug/:reportId/history', reportHistory);

// router.put('/bug/:reportId/revert/:updateId', revertToVersion);

module.exports = router;