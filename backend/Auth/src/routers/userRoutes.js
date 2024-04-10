/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and authorization
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         FirstName:
 *           type: string
 *         LastName:
 *           type: string
 *         UserEmail:
 *           type: string
 *         UserPasswordHash:
 *           type: string
 *         UserCPassword:
 *           type: string
 *
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       properties:
 *         UserEmail:
 *           type: string
 *           format: email
 *         UserPasswordHash:
 *           type: string
 *           pattern: "^[A-Za-z0-9]"
 */

/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User registration successful
 *       400:
 *         description: Bad request or validation error
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: User login successful
 *       400:
 *         description: Bad request or validation error
 *       401:
 *         description: Incorrect password or user not found
 *       500:
 *         description: Internal server error
 *   security:
 *     - BearerAuth: []
 */

/**
 * @swagger
 * /user/logout:
 *   get:
 *     summary: Logout a user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: User logout successful
 *       500:
 *         description: Internal server error
 *   security:
 *     - BearerAuth: []
 */

/**
 * @swagger
 * /protected:
 *   get:
 *     summary: Protected route
 *     description: Displays a message for authenticated users
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *       401:
 *         description: Authentication failed
 *   security:
 *     - BearerAuth: []
 */

const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controllers/authController');
const verifyToken = require('../middlewares/authMiddleware');
const userRoutes = express.Router();

userRoutes.post('/user/signup', registerUser); 
userRoutes.post('/user/login', loginUser);
userRoutes.post('/user/logout', logoutUser);

const isAuthorized = (allowedRoles) => {
    return (req, res, next) => {
      if (allowedRoles.includes(req.userRole)) {
        next();
      } else {
        res.status(403).json({ message: 'Unauthorized' });
      }
    };
};

userRoutes.use('/protected', verifyToken, isAuthorized([1, 'user']), (req, res) => {
  res.send('Hello!');
});

module.exports = userRoutes;
