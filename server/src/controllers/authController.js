import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Users } from '../db/db.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_key_eshop_2026_dev', {
    expiresIn: '30d',
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = Users.findOne((u) => u.email.toLowerCase() === normalizedEmail);

    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = Users.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: 'customer',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    });

    const token = generateToken(newUser.id);
    const { password: _, ...userProfile } = newUser;

    res.status(201).json({
      success: true,
      token,
      user: userProfile,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Internal server error during registration' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = Users.findOne((u) => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user.id);
    const { password: _, ...userProfile } = user;

    res.json({
      success: true,
      token,
      user: userProfile,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error during login' });
  }
};

export const getMe = (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

export const updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (avatar) updateData.avatar = avatar;

    const updated = Users.updateById(req.user.id, updateData);
    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password: _, ...userProfile } = updated;
    res.json({
      success: true,
      user: userProfile,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
};
