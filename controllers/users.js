const Users = require("../model/users");
const { comparePassword, hashPassword } = require("../middlewares/auth");

// signup function
const signup = async (req, res) => {
    const { name, username, password, isAdmin, role } = req.body;
    try {
        const existingUser = await Users.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await Users.create({
            name,
            username,
            password: hashedPassword,
            isAdmin,
            role
        });

        res.status(200).json({ user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
};

// login function
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await Users.findOne({ username });

        if (!existingUser) {
            return res.status(404).json({ error: "User Not Found" });
        }

        const matchPassword = await comparePassword(password, existingUser.password);
        if (matchPassword) {
            res.status(201).json({ user: existingUser, role: existingUser.role });
        } else {
            return res.status(400).json({ error: "Invalid Credentials" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
};

// Get user profile
const getProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await Users.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        } else {
            res.json(user);
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update user profile
const updateUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { name, image } = req.body;

        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.name = name;
        user.image = image; 

        await user.save();

        res.json({ message: 'User profile updated successfully', user });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await Users.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { signup, login, updateUser, getProfile, getAllUsers };