import { Router } from 'express';
import addOrganisationUsers from '../handlers/organisations/addOrganisationUsers';
import createOrganisation from '../handlers/organisations/createOrganisation';
import deleteOrganisationById from '../handlers/organisations/deleteOrganisationById';
import getOrganisationById from '../handlers/organisations/getOrganisationById';
import getOrganisationUsers from '../handlers/organisations/getOrganisationUsers';
import updateOrganisation from '../handlers/organisations/updateOrganisation';

/**
 * Express router for handling organisations-related routes.
 *
 * @remarks
 * This router handles the following routes:
 * - GET /api/organisation/:id - Retrieve an organisation
 * - GET /api/organisation/users - Get all members/users of an organisation
 * - POST /api/organisation/invite - create organisation invitation link
 * - POST /api/organisation/create - create a new organisation
 * - POST /api//organisations/users - Add a user to an organisation
 * - PUT /api/organisations - Update an organisation
 * - DELETE /api//organisations/:id - delete an organisation
 *
 * @packageDocumentation
 */

// Router instance for Organization routes
const router = Router();

/**
 * @openapi
 * /api/organisations:
 *   get:
 *     tags:
 *        - Organisations
 *     summary: Retrieve information about an organizations using it's ID
 *     parameters:
 *      - in: query
 *        name: orgId
 *        required: true
 *        schema:
 *          type: integer
 *     responses:
 *        200:
 *            description: Organisation found.
 *            content:
 *                    application/json:
 *                      schema:
 *                              type: array
 *                              items:
 *                                $ref: '#/components/schemas/Organisation'
 *                      example:
 *                          {"message":"Organisation found","org":{"id":1,"name":"Andela","departments":[{"id":1,"name":"General","organisationId":1,"createdAt":"2021-08-30T14:00:00.000Z","updatedAt":"2021-08-30T14:00:00.000Z"},{"id":2,"name":"Announcements","organisationId":1,"createdAt":"2021-08-30T14:00:00.000Z","updatedAt":"2021-08-30T14:00:00.000Z"}],"createdAt":"2021-08-30T14:00:00.000Z","updatedAt":"2021-08-30T14:00:00.000Z"},"isSuccess":true}
 *                              
 *        400:
 *            description: Organisation not found
 *            content:
 *                    application/json:
 *                      schema:
 *                              type: object
 *                              items:
 *                                $ref: '#/components/schemas/ErrorResponse'
 *                      example:
 *                          {"message":"Organisation not found","isSuccess":false}
 * 
 * 
 */
router.get('/organisations', getOrganisationById)

  /**
 * @openapi
 * /api/organisation/users:
 *   get:
 *     tags:
 *        - Organisations
 *     summary: Get all members/users of an organisation
 *     parameters:
 *      - in: query
 *        name: orgId
 *        required: true
 *        schema:
 *          type: integer
 *     responses:
 *        200:
 *            description: Users found.
 *            content:
 *                    application/json:
 *                      schema:
 *                              type: array
 *                              items:
 *                                $ref: '#/components/schemas/User'
 *                      example:
 *                          {"message":"Users found","users":[{"id":1,"name":"John Doe","email":"johndoe@example.com","createdAt":"2021-08-30T14:00:00.000Z","updatedAt":"2021-08-30T14:00:00.000Z"},{"id":2,"name":"Jane Smith","email":"janesmith@example.com","createdAt":"2021-08-30T14:00:00.000Z","updatedAt":"2021-08-30T14:00:00.000Z"}],"isSuccess":true}
 *                              
 *        400:
 *            description: Organisation not found
 *            content:
 *                    application/json:
 *                      schema:
 *                              type: object
 *                              items:
 *                                $ref: '#/components/schemas/ErrorResponse'
 *                      example:
 *                          {"message":"Organisation not found","isSuccess":false}
 * 
 * 
 */
router.get('/organisation/users', getOrganisationUsers)
  
  
/**
 * @openapi
 * /api/organisation/create:
 *    post:
 *        tags:
 *            - Organisations
 *        summary: Create a new organization
 *        requestBody:
 *            content:
 *                application/json:
 *                    schema:
 *                        $ref: '#/components/schemas/CreateOrganisation'
 *                    example:
 *                        userId: 1
 *                        name: "Andela"
 *        responses:
 *            200:
 *                description: Organization created successfully
 *                content:
 *                    application/json:
 *                        schema:
 *                            type: object
 *                        example:
 *                            message: "Organization created successfully!"
 *                            isSuccess: true
 *                            org: {"id":1,"name":"Andela","createdAt":"2021-08-30T14:00:00.000Z","updatedAt":"2021-08-30T14:00:00.000Z"}
 *            400:
 *                description: Bad Request
 *                content:
 *                    application/json:
 *                        schema:
 *                            type: object
 *                        example:
 *                            error: ["Invalid input"]
 *                            isSuccess: false
 *            500:
 *                description: An error occurred while creating the organization
 *                content:
 *                    application/json:
 *                        schema:
 *                            type: object
 *                        example:
 *                            error: "An error occurred while creating the organization"
 *                            isSuccess: false
 *            
 */
router.post('/organisation/create', createOrganisation)

/**
 * @openapi
 * /api/organisations/users:
 *   post:
 *     tags:
 *        - Organisations
 *     summary: Add a user to an organisation
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddUserToOrganisation'
 *           example:
 *             userId: 1
 *             organisationId: 1
 *     responses:
 *        200:
 *            description: User added to organisation successfully.
 *            content:
 *                    application/json:
 *                      schema:
 *                              type: object
 *                              items:
 *                                $ref: '#/components/schemas/SuccessResponse'
 *                      example:
 *                          {"message":"User added to organisation successfully","isSuccess":true}
 *                              
 *        400:
 *            description: Bad Request
 *            content:
 *                    application/json:
 *                      schema:
 *                              type: object
 *                              items:
 *                                $ref: '#/components/schemas/ErrorResponse'
 *                      example:
 *                          {"message":"Invalid input","isSuccess":false}
 * 
 * 
 */
router.post('/organisations/users', addOrganisationUsers)

/**
 * @openapi
 * /api/organisation/update:
 *   put:
 *     tags:
 *        - Organisations
 *     summary: Update an organisation
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrganisation'
 *           example:
 *             orgId: 1
 *             name: "ALX"
 *     responses:
 *        200:
 *            description: Organisation updated successfully.
 *            content:
 *                    application/json:
 *                      schema:
 *                              type: object
 *                      example:
 *                          message: "Organisation updated successfully"
 *                          isSuccess: true
 *        400:
 *            description: Bad Request
 *            content:
 *                    application/json:
 *                      schema:
 *                              type: object
 *                      example:
 *                          message: "Invalid input"
 *                          isSuccess: false
 *        404:
 *            description: Organisation not found
 *            content:
 *                    application/json:
 *                      schema:
 *                              type: object
 *                      example:
 *                          message: "Organisation not found"
 *                          isSuccess: false
 *        500:
 *            description: An error occurred while updating the organisation
 *            content:
 *                    application/json:
 *                      schema:
 *                              type: object
 *                      example:
 *                          message: "An error occurred while updating the organisation"
 *                          isSuccess: false
 * 
 */
router.put('/organisation/update', updateOrganisation)


/**
 * @openapi
 * /api/organisation:
 *   delete:
 *     tags:
 *        - Organisations
 *     summary: Delete an organisation by ID
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *     responses:
 *        200:
 *            description: Organisation deleted successfully.
 *            content:
 *                    application/json:
 *                      schema:
 *                              type: object
 *                              items:
 *                                $ref: '#/components/schemas/SuccessResponse'
 *                      example:
 *                          {"message":"Organisation deleted successfully","isSuccess":true}
 *                              
 *        400:
 *            description: Organisation not found
 *            content:
 *                    application/json:
 *                      schema:
 *                              type: object
 *                              items:
 *                                $ref: '#/components/schemas/ErrorResponse'
 *                      example:
 *                          {"message":"Organisation not found","isSuccess":false}
 * 
 * 
 */
router.delete('/organisation', deleteOrganisationById);

export default router;