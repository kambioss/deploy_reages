const express = require('express');
const User = require('../models/User');
const { validateUser } = require('../middleware/validation');
const logger = require('../utils/logger');

const router = express.Router();

// Get all users (admin only)
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      country,
      sector,
      role,
      is_active,
      search
    } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      country,
      sector,
      role,
      is_active: is_active === 'true' ? true : is_active === 'false' ? false : undefined,
      search
    };

    const result = await User.findAll(options);

    res.json({
      success: true,
      data: result.users,
      pagination: result.pagination
    });
  } catch (error) {
    logger.error('Error getting users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get users',
      message: 'Internal server error'
    });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'User with the specified ID does not exist'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error('Error getting user by ID:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user',
      message: 'Internal server error'
    });
  }
});

// Update user (admin or self)
router.put('/:id', validateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      phone,
      country,
      function: userFunction,
      sector,
      organization,
      bio,
      avatar_url,
      is_active,
      is_verified,
      role
    } = req.body;

    // Get current user info
    const currentUserId = req.kauth.grant.access_token.content.sub;
    const currentUser = await User.findByKeycloakId(currentUserId);
    
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
        message: 'Authenticated user not found in database'
      });
    }

    // Check if user exists
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'User with the specified ID does not exist'
      });
    }

    // Check permissions (admin can edit any user, users can edit themselves)
    if (existingUser.id !== currentUser.id && currentUser.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Permission denied',
        message: 'You can only edit your own profile'
      });
    }

    // Regular users can only update certain fields
    const userData = {};
    if (currentUser.role === 'admin') {
      // Admin can update all fields
      Object.assign(userData, {
        first_name,
        last_name,
        phone,
        country,
        function: userFunction,
        sector,
        organization,
        bio,
        avatar_url,
        is_active,
        is_verified,
        role
      });
    } else {
      // Regular users can only update their own profile
      Object.assign(userData, {
        first_name,
        last_name,
        phone,
        country,
        function: userFunction,
        sector,
        organization,
        bio,
        avatar_url
      });
    }

    const updatedUser = await User.update(id, userData);

    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    logger.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user',
      message: 'Internal server error'
    });
  }
});

// Delete user (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get current user info
    const currentUserId = req.kauth.grant.access_token.content.sub;
    const currentUser = await User.findByKeycloakId(currentUserId);
    
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
        message: 'Authenticated user not found in database'
      });
    }

    // Check if user is admin
    if (currentUser.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Permission denied',
        message: 'Only administrators can delete users'
      });
    }

    // Check if user exists
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'User with the specified ID does not exist'
      });
    }

    // Prevent self-deletion
    if (existingUser.id === currentUser.id) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete yourself',
        message: 'You cannot delete your own account'
      });
    }

    const deletedUser = await User.delete(id);

    res.json({
      success: true,
      message: 'User deleted successfully',
      data: deletedUser
    });
  } catch (error) {
    logger.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user',
      message: 'Internal server error'
    });
  }
});

// Get user statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await User.getStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Error getting user stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user statistics',
      message: 'Internal server error'
    });
  }
});

module.exports = router;