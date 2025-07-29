const User = require("../models/userModel");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ✅ Register User
exports.registerUser = async (req, res) => {
    try {
        const {firstname, lastname, email, password, role = 'user', active = '0' } = req.body;

        if (!firstname || !lastname || !email || !password ) {
            return res.status(400).json({ message: 'All fields are required!', success: false });
        }

        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(409).json({ message: 'User already exists!', success: false });
        }

        const newUser = new User({firstname, lastname, email, password, role, active });
        await newUser.save();

        return res.status(201).json({
            message: 'User registered successfully!',
            success: true,
            user: {
                id: newUser._id,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                email: newUser.email
                
            }
        });
    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};

// ✅ Login User
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.', success: false });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.', success: false });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(403).json({ message: 'Invalid password.', success: false });
        }

        user.active = '1';
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        return res.status(200).json({
            message: 'Login successful.',
            success: true,
            user: {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                role: user.role,
                active: user.active,
                token
            }
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};

// ✅ Get All Users
exports.allUser = async (req, res) => {
    try {
        const users = await User.find().select('-password').lean();
        return res.status(200).json({
            message: 'All users fetched successfully.',
            success: true,
            users
        });
    } catch (error) {
        console.error("Fetch Users Error:", error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};

// current user

exports.currentUser = async(req,res)=>{
    try {
        const {id} = req.user;

          if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid user ID.', success: false });
        }

        const user = await User.findById(id).select('-password')

         if (!user) {
            return res.status(404).json({ message: 'User not found.', success: false });
        }

        return res.status(200).json({
            message: 'Current user fetched successfully.',
            success: true,
            user
        });

        
    } catch (error) {
        console.error("Fetch User Error:", error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
}

// ✅ Get User by ID
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid user ID.', success: false });
        }

        const user = await User.findById(id).select('-password').lean();
        if (!user) {
            return res.status(404).json({ message: 'User not found.', success: false });
        }

        return res.status(200).json({
            message: 'User fetched successfully.',
            success: true,
            user
        });
    } catch (error) {
        console.error("Fetch User Error:", error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};

// ✅ Logout User
exports.logoutUser = async (req, res) => {
    try {
        const { id } = req.user;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid user ID.', success: false });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.', success: false });
        }
        if(user.active==='0'){
            return res.status(404).json({ message: 'User logeedout already.', success: false });
        }

        user.active = '0';
        await user.save();

        return res.status(200).json({
            message: 'User logged out successfully.',
            success: true
        });
    } catch (error) {
        console.error("Logout Error:", error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};


// delete a user

exports.deleteUser = async(req,res)=>{
    try {

        const {id} = req.params;

        if(!isValidObjectId(id)){
           return res.status(400).json({ message: 'Invalid user ID.', success: false });
        }
        
       const deletedUser = await User.findByIdAndUpdate(id);

        
        if(!deletedUser){
            return res.status(404).json({ message: 'User not found or Deleted Already !.', success: false });

        }
         return res.status(200).json({
            message: 'User deleted successfully.',
            success: true
        });

    } catch (error) {
          console.error("Delete Error:", error);
        return res.status(500).json({ message: 'Internal server error', success: false });
        
    }
}
