const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {

    getUser: async function (req, res) {
        try {
            const users = await User.find().sort();
            if (users) {
                res.status(200).json({ success: true, message: "Users retrieved successfully", users });
            } else {
                res.status(404).json({ success: false, message: "Users not found" });
            }
        } catch (err) {
            res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
        }
    },

    getUserByID: async function (req, res) {
        try {
            const user = await User.findById(req.params.id);
            if (user) {
                res.status(200).json({ success: true, message: "User retrieved successfully", user });
            } else {
                res.status(404).json({ success: false, message: "User not found" });
            }
        } catch (err) {
            res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
        }
    },

    addUser: async function (req, res) {
        try {
            const { username, email, password } = req.body;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = new User({
                username,
                email,
                password: hashedPassword,
            });

            const savedUser = await newUser.save();
            res.status(201).json({ success: true, message: "User Registerd successfully!", user: savedUser });
        } catch (err) {
            res.status(500).json({ success: false, message: "User cannot be created!", error: err.message });
        }
    },

    editUser: async function (req, res) {
        try {
            const { id } = req.params;
            const { username, email, password, phone, village_apartment, pincode, city, state, country } = req.body;

            const updateData = {
                username,
                email,
                phone,
                village_apartment,
                pincode,
                city,
                state,
                country,
            };

            if (password) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                updateData.password = hashedPassword;
            }

            const updatedUser = await User.findByIdAndUpdate(
                id,
                updateData,
                { new: true }
            );

            if (updatedUser) {
                res.status(200).json({ success: true, message: "User updated successfully", user: updatedUser });
            } else {
                res.status(404).json({ success: false, message: "User not found" });
            }
        } catch (err) {
            res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
        }
    },

    userLogin: async function (req, res) {
        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(404).json({ success: false, message: "Email not found" });
            }
            const isMatch = bcrypt.compareSync(req.body.password, user.password);
            if (isMatch) {
                const token = jwt.sign(
                    {
                        userId: user._id,
                        role: user.role
                    },
                    process.env.SECRET,
                    { expiresIn: '1d' }
                );
                return res.status(200).json({ success: true, user: user.email, token: token, role: user.role });
            } else {
                return res.status(400).json({ success: false, message: "Password is incorrect!" });
            }
        } catch (err) {
            return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
        }
    },


    superAdminApproveAdminOrUser: async function (req, res) {
        const { userId } = req.params;
        const { roleToApprove } = req.body; // { roleToApprove: 'admin' } or { roleToApprove: 'user' }

        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            if (roleToApprove === 'admin') {
                user.role = 'admin';
                user.approved = true;
            } else if (roleToApprove === 'user') {
                user.approved = true;
            } else {
                return res.status(400).json({ success: false, message: "Invalid role to approve" });
            }

            await user.save();

            res.status(200).json({ success: true, message: `${roleToApprove} approved successfully`, user });
        } catch (err) {
            console.error('Server error:', err);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    },

    adminApproveUser: async function (req, res) {
        const { userId } = req.params;

        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            user.approved = true;
            await user.save();

            res.status(200).json({ success: true, message: "User approved successfully", user });
        } catch (err) {
            console.error('Server error:', err);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }
};
