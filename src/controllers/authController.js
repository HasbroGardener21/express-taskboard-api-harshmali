const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } // Short-lived access
  );
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' } // Long-lived session
  );
  return { accessToken, refreshToken };
};

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user
    const user = await User.create({
      email,
      password: hashedPassword,
      role: 'user' // Explicitly set as a standard user
    });

    res.status(201).json({ 
      message: 'User registered successfully', 
      user: { id: user._id, email: user.email, role: user.role } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (!user.isActive) {
      return res.status(403).json({ message: 'Account deactivated' });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Save refresh token to DB to track the active session
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      user: { id: user._id, email: user.email, role: user.role },
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
};

exports.refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ message: 'Refresh token required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    // Prevent reuse of revoked or overwritten tokens
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Issue a fresh access token
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({ message: 'Refresh token expired or invalid' });
  }
};

exports.logout = async (req, res) => {
  try {
    // req.user comes from your existing authMiddleware
    const { id } = req.user; 
    await User.findByIdAndUpdate(id, { refreshToken: null });
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during logout' });
  }
};