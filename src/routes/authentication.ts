import { Router, Request, Response } from 'express';
import createNewUser from '../handlers/authentication/createUser'
import signin from '../handlers/authentication/signin'
import verifyOtp from '../handlers/authentication/verifyOtp';


const router = Router();
/**
 * @openapi
 * /signup:
 *  post:
 *      tags:
 *          - Authentication
 *      summary: Create a new user
 *      description: Endpoint to create a new user account
 *      requestBody:
 *        required: true
 *        content:
 *           application/json:
 *             schema:
 *                  type: object
 *                  items:
 *                     $ref: '#/components/schemas/SignupRequest'
 *             example:
 *                 email: "testuser@gmail.com"
 *                 password: "testuser"
 *                 name: "Test User"
 *      responses:
 *          200:
 *              description: Account created successfully
 *              content:
 *                 application/json:
 *                   schema:
 *                      type: object
 *                      items:
 *                         $ref: '#/components/schemas/CreateUserResponse'
 *                   example:
 *                     message: "Account Created successfully"
 *                     token: "JIUzI1NiIsIn"
 *                     user: {"id": 1, "name": "Test user", "email": "testuser2@gmail.com", "createdAt": "2021-08-25T12:00:00.000Z", "updatedAt": "2021-08-25T12:00:00.000Z"}
 *                     isSuccess: true
 *          400:
 *             description: Bad Request
 *             content:
 *               application/json:
 *                schema:
 *                 type: object
 *                example:
 *                 message: "Bad Request"
 *                 isSuccess: false
 *          409:
 *            description: User already exists
 *            content:
 *             application/json:
 *               schema:
 *                type: object
 *               example:
 *                  message: "User already Exists"
 *                  isSuccess: false
 * 
 */
router.post('/signup', createNewUser)

/**
 * @openapi
 * /auth/login:
 *  post:
 *      tags:
 *          - Authentication
 *      summary: User login
 *      description: Endpoint to authenticate a user and generate a token
 *      requestBody:
 *         required: true
 *         content:
 *            application/json:
 *               schema:
 *                 type: object
 *                 items:
 *                      $ref: '#/components/schemas/LoginRequest'
 *               example:
 *                 email: "testuser@gmail.com"
 *                 password: "testuser"
 *      responses:
 *        200:
 *         description: User logged in successfully
 *         content:
 *              application/json:
 *                 schema:
 *                     $ref: '#/components/schemas/LoginSuccessResponse'
 *                 example:
 *                    message: "User logged in successfully"
 *                    token: "JIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm"
 *                    user: {"id": 1, "email": "testuser@gmail.com", "name": "Test User", "createdAt": "2021-08-25T12:00:00.000Z", "updatedAt": "2021-08-25T12:00:00.000Z", "organizations": [], "departments": [], "role": []}
 *                    isSucess: true
 *        400:
 *         description: No user found
 *         content:
 *             application/json:
 *                schema:
 *                    type: object
 *                example:
 *                    message: "No user found"
 *                    isSuccess: false
 * 
 * 
 * components:
 *      schemas:
 *          LoginRequest:
 *              type: object
 *              properties:
 *                  email:
 *                      type: string
 *                      format: email
 *                  password:
 *                      type: string
 *              required: [email, password]
 *          LoginSuccessResponse:
 *             type: object
 *             properties:
 *                  message:
 *                      type: string
 *                  token:
 *                      type: string
 *                  user:
 *                      type: object
 *                  isSuccess:
 *                      type: boolean
 * 
 * 
 */
router.post('/login', signin)

/**
 * @openapi
 * /auth/logout:
 *  post:
 *      tags:
 *          - Authentication
 *      summary: User logout
 *      description: Endpoint to log out a user
 *      responses:
 *        200:
 *         description: User logged out successfully
 *         content:
 *              application/json:
 *                 schema:
 *                     $ref: '#/components/schemas/LogoutResponse'
 *                 example:
 *                    message: "User logged out successfully"
 *                    isSuccess: true
 */
router.post('/logout', (req: Request, res: Response) => {  
})

/**
 * @openapi
 * /auth/otp:
 *  post:
 *      tags:
 *          - Authentication
 *      summary: Verify the otp received by the user
 *      description: This endpoint verifies the user's otp if it's valid
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      items:
 *                          $ref: '#/components/schemas/verifyOtpRequest'
 *                  example:
 *                      userId: 3
 *                      otp: 234567
 *      responses:
 *          200:
 *              description: Valid otp
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                      example:
 *                          message: valid otp
 *                          isSuccess: true
 *          400:
 *              description: Invalid otp
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                      example:
 *                          message: invalid otp
 *                          isSuccess: false
 */
router.post('/otp', verifyOtp)


export default router;