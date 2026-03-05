const User = require('../models/User');
const logger = require('../utils/logger');

class AuthController {
  // Handle Keycloak callback after successful authentication
  static async handleKeycloakCallback(req, res) {
    try {
      const { kauth } = req;
      
      if (!kauth || !kauth.grant) {
        return res.status(401).json({
          error: 'Authentication failed',
          message: 'No authentication grant found'
        });
      }

      const accessToken = kauth.grant.access_token;
      const userInfo = accessToken.content;

      // Extract user information from Keycloak token
      const keycloakId = userInfo.sub;
      const email = userInfo.email;
      const firstName = userInfo.given_name || userInfo.firstName;
      const lastName = userInfo.family_name || userInfo.lastName;

      if (!keycloakId || !email) {
        return res.status(400).json({
          error: 'Invalid user data',
          message: 'Keycloak ID and email are required'
        });
      }

      // Find or create user in our database
      let user = await User.findByKeycloakId(keycloakId);
      
      if (!user) {
        // Check if user exists with same email
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
          return res.status(409).json({
            error: 'Email already exists',
            message: 'This email is already registered with a different account'
          });
        }

        // Create new user
        user = await User.create({
          keycloak_id: keycloakId,
          email: email,
          first_name: firstName || '',
          last_name: lastName || '',
          is_verified: userInfo.email_verified || false
        });
      } else {
        // Update last login
        await User.updateLastLogin(user.id);
      }

      // Set user session
      req.session.user = {
        id: user.id,
        keycloak_id: user.keycloak_id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      };

      res.json({
        message: 'Authentication successful',
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          is_verified: user.is_verified
        }
      });
    } catch (error) {
      logger.error('Error in Keycloak callback:', error);
      res.status(500).json({
        error: 'Authentication failed',
        message: 'Internal server error'
      });
    }
  }

  // Get current user profile
  static async getProfile(req, res) {
    try {
      const { kauth } = req;
      
      if (!kauth || !kauth.grant) {
        return res.status(401).json({
          error: 'Not authenticated',
          message: 'No authentication token found'
        });
      }

      const accessToken = kauth.grant.access_token;
      const userInfo = accessToken.content;
      const keycloakId = userInfo.sub;

      const user = await User.findByKeycloakId(keycloakId);
      
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          message: 'User not found in database'
        });
      }

      res.json({
        user: {
          id: user.id,
          keycloak_id: user.keycloak_id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          country: user.country,
          function: user.function,
          sector: user.sector,
          organization: user.organization,
          bio: user.bio,
          avatar_url: user.avatar_url,
          is_active: user.is_active,
          is_verified: user.is_verified,
          role: user.role,
          created_at: user.created_at,
          updated_at: user.updated_at,
          last_login: user.last_login
        }
      });
    } catch (error) {
      logger.error('Error getting user profile:', error);
      res.status(500).json({
        error: 'Failed to get profile',
        message: 'Internal server error'
      });
    }
  }

  // Update user profile
  static async updateProfile(req, res) {
    try {
      const { kauth } = req;
      
      if (!kauth || !kauth.grant) {
        return res.status(401).json({
          error: 'Not authenticated',
          message: 'No authentication token found'
        });
      }

      const accessToken = kauth.grant.access_token;
      const userInfo = accessToken.content;
      const keycloakId = userInfo.sub;

      const user = await User.findByKeycloakId(keycloakId);
      
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          message: 'User not found in database'
        });
      }

      const {
        first_name,
        last_name,
        phone,
        country,
        function: userFunction,
        sector,
        organization,
        bio,
        avatar_url
      } = req.body;

      const updatedUser = await User.update(user.id, {
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

      res.json({
        message: 'Profile updated successfully',
        user: updatedUser
      });
    } catch (error) {
      logger.error('Error updating profile:', error);
      res.status(500).json({
        error: 'Failed to update profile',
        message: 'Internal server error'
      });
    }
  }

  // Complete user registration (additional info after Keycloak auth)
  static async completeRegistration(req, res) {
    try {
      const { kauth } = req;
      
      if (!kauth || !kauth.grant) {
        return res.status(401).json({
          error: 'Not authenticated',
          message: 'No authentication token found'
        });
      }

      const accessToken = kauth.grant.access_token;
      const userInfo = accessToken.content;
      const keycloakId = userInfo.sub;

      const user = await User.findByKeycloakId(keycloakId);
      
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          message: 'User not found in database'
        });
      }

      const {
        phone,
        country,
        function: userFunction,
        sector,
        organization,
        bio
      } = req.body;

      // Validation
      if (!country || !userFunction || !sector) {
        return res.status(400).json({
          error: 'Missing required fields',
          message: 'Country, function, and sector are required'
        });
      }

      const updatedUser = await User.update(user.id, {
        phone,
        country,
        function: userFunction,
        sector,
        organization,
        bio
      });

      res.json({
        message: 'Registration completed successfully',
        user: updatedUser
      });
    } catch (error) {
      logger.error('Error completing registration:', error);
      res.status(500).json({
        error: 'Failed to complete registration',
        message: 'Internal server error'
      });
    }
  }

  // Logout user
  static async logout(req, res) {
    try {
      const { kauth } = req;
      
      if (kauth && kauth.grant) {
        // Clear Keycloak session
        kauth.grantManager.logout(req.session, req, res);
      }

      // Clear local session
      req.session.destroy((err) => {
        if (err) {
          logger.error('Error destroying session:', err);
        }
      });

      res.json({
        message: 'Logout successful'
      });
    } catch (error) {
      logger.error('Error during logout:', error);
      res.status(500).json({
        error: 'Logout failed',
        message: 'Internal server error'
      });
    }
  }

  // Check authentication status
  static async checkAuth(req, res) {
    try {
      const { kauth } = req;
      
      if (!kauth || !kauth.grant) {
        return res.json({
          authenticated: false,
          user: null
        });
      }

      const accessToken = kauth.grant.access_token;
      const userInfo = accessToken.content;
      const keycloakId = userInfo.sub;

      const user = await User.findByKeycloakId(keycloakId);
      
      if (!user) {
        return res.json({
          authenticated: false,
          user: null
        });
      }

      res.json({
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          is_verified: user.is_verified
        }
      });
    } catch (error) {
      logger.error('Error checking auth status:', error);
      res.status(500).json({
        error: 'Failed to check authentication status',
        message: 'Internal server error'
      });
    }
  }

  // Get Keycloak configuration for frontend
  static async getKeycloakConfig(req, res) {
    try {
      const config = require('../config');
      
      res.json({
        url: config.keycloak.url,
        realm: config.keycloak.realm,
        clientId: config.keycloak.clientId,
        logoutUrl: config.keycloak.logoutUrl
      });
    } catch (error) {
      logger.error('Error getting Keycloak config:', error);
      res.status(500).json({
        error: 'Failed to get Keycloak configuration',
        message: 'Internal server error'
      });
    }
  }
}

module.exports = AuthController;