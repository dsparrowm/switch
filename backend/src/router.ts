import { Router } from 'express';
import sibapiv3sdk from 'sib-api-v3-sdk'
import { sendorgInviteLink } from './handlers/invitelink';
import prisma from './db';

const router = Router();

/**
 * DEPARTMENTS
 */
router.get('/departments', async (req, res) => {
    try {
        const departmentId = parseInt(req.query.departmentId);
        const department = await prisma.department.findUnique({
            where: {id: departmentId},
            include: {
                tasks: {orderBy: {createdAt: 'asc'}},
                messages: {
                    orderBy: {
                        createdAt: 'asc'
                    }
                }
            }
        })
        if (department === null) {
            res.status(400).json({message: "No department found", isSuccess: false})
            return
        }
        res.status(200).json({department, isSuccess: true})
    } catch (err) {
       res.status(404).json({message: err.message, isSuccess: false})
    }
})
router.post('/departments/join', async (req, res) => {
    const {userIds, adminOrDeptHeadId, departmentId} = req.body;
    try {
        const manager = await prisma.user.findUnique({
            where: {id: adminOrDeptHeadId}, include: {roles: true}
        })
        const addUsersToDept = await prisma.department.update({
            where: {
                id: departmentId
            },
            data: {
                users: {
                    create: userIds.map((id) => ({
                        userId: id
                    })),
                },
            },
        })
        res.status(200).json({message: `User(s) added successfully to department`, isSuccess: true})

    } catch (err) {
        res.json({error: err.message})
    }
})
router.post('/departments/new', async (req, res) => {
    try {
        const {userId, departmentName, orgId} = req.body;
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                roles: {include: {role: true}}
            }
        })
        if (user === null) {
            res.json({message: "User does not exist", isSucccess: false});
        }
        if (!user.roles.some(userRole => userRole.role.name === "admin" && userRole.organisationId === orgId)) {
            return res.json({message: "You do not have the permission to create a department, please contact your Admin", isSuccess: false});
          }
        const newDepartment = await prisma.department.create({
            data: {
                name: departmentName,
                organisationId: orgId

            }
        })
        const admins = await prisma.userRole.findMany({
            where: {
                role: {
                    name: {
                        equals: "admin"
                    }
                }
            },
            include: {role: true}
        })
        for (let admin of admins) {
            await prisma.userDepartment.create({
                data: {
                    userId: admin.id,
                    departmentId: newDepartment.id
                }
            })
        }
        res.status(200);
        res.json({message: "Department created successfully", isSuccess: true})
    } catch (err) {
        console.error(err)
        res.json({message: "There was an issue with the database connection", isSuccess: false})
    }
})
router.put('/departments/:id', () => {})
router.delete('/departments/:id', () => {})

/**
 * TASKS
 */
router.get('/tasks', (req, res) => {
    res.json({message: "Welcome"})
})
router.get('/tasks/:id', () => {})
router.post('/tasks/create', async (req, res) => {
    const {assignedToUserId, taskTitle, description, deadline, deptId} = req.body;
    try {
       const createTask = await prisma.task.create({
        data: {
            title: taskTitle,
            description,
            departmentId: deptId,
            userId: assignedToUserId,
        }
       }) 
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})
router.put('/tasks/:id', () => {})
router.delete('/tasks/:id', () => {})

/**
 * ORGANISATIONS
 */
router.get('/organisations', async (req, res) => {
    const {orgId} = req.query
    try {
       const org = await prisma.organisation.findUnique({
        where: {
            id: parseInt(orgId)
        },
        include: {
            departments: true
        }
       })
       res.status(200).json({message: "Organisation found", org, isSuccess: true})
    } catch (err) {
        res.status(400).json({message: err.message, isSuccess: false})
    }
})
router.post('/organisations/invitation/create', async (req, res) => {
    const { organisationId, userId }= req.body;
    try {
        //Check if organisation exists
        const organisation = await prisma.organisation.findUnique({
            where: {id: organisationId}
        })
        if (organisation === null) {
            return res.status(400).json({message: "organisation not found"})
        }
        // Delete old invitation if it exists
        const oldInvitation = await prisma.invitation.findUnique({
            where: {organisationId}
        })
        if (oldInvitation) {
            await prisma.invitation.delete({ where: { id: oldInvitation.id } });
        }

        // Generate new unique code for invitation
        const code = Math.random().toString(36).substring(2, 15);

        // Create new invitation
        const newInvitation = await prisma.invitation.create({
            data: {
                code,
                organisationId,
                userId,
            },
        });

        // Update organisation with new invitationId
        await prisma.organisation.update({
            where: { id: organisationId },
            data: { invitationId: newInvitation.id },
        });

        res.status(200).json({ message: 'Invitation link created successfully!', code, organisationName: organisation.name, isSuccess: true });
    } catch (err) {
        res.status(400).json({message: "An error occurred while creating the invitation link"})
    }
})
router.get('/organisations/users', async (req, res) => {
    try {
        const id = parseInt(req.query.id)
        const users = await prisma.userOrganisation.findMany({
            where: {
                organisationId: id
            },
            include: {
                user: true,
                organisation: true
            }
        });
        if (users === null) {
            res.status(400)
            res.json({message: "No organization found", isSuccess: false})
            return
        }
        res.status(200);
        res.json({users, isSuccess: true, NoOfUsers: users.length}) 
    } catch (err) {
        res.status(500);
        res.json({error: err.message, isSuccess: false})
    }
})
router.post('/organisation/new', async (req, res) => {
    const {userId, name} = req.body;
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })
    if (user === null) {
        res.json({message: "User does not exist, please create an account"})
        return
    }
    try {
        // Create the Organization
        const createOrg = await prisma.organisation.create({
            data: {
                name,
            }
        });
        
        // Create a new Role called Admin for the user who created the organization
        const createRole = await prisma.role.create({
            data: {
                name: "admin"
            }
        })
        // Update the user by changing his role to admin
        const updateUser = await prisma.userRole.create({
            data: {
                userId,
                roleId: createRole.id,
                organisationId: createOrg.id
            }
        })
        // Create 2 new departments for the organization
        const generalDepartment = await prisma.department.create({
            data: {
                name: "General",
                organisationId: createOrg.id
            }
        });
        const annoucementDepartment = await prisma.department.create({
            data: {
                name: "Announcements",
                organisationId: createOrg.id,
            }
        })
        // Add the Admin to all departments in his organisation
        // First get all the departments in the organisation
        const departments = await prisma.department.findMany({
            where: {organisationId: createOrg.id}
        })
        for (let department of departments) {
            await prisma.userDepartment.create({
                data: {
                    userId,
                    departmentId: department.id
                }
            })
        }
        // Add user to the organisation
        await prisma.userOrganisation.create({
            data: {
                userId,
                organisationId: createOrg.id
            }
        })
        const org = createOrg
        res.status(200);
        res.json({message: 'Organization created successfully!', isSuccess: true, org})
    } catch (err) {
        res.status(500);
        res.json({error: `${err.message}`, isSuccess: true,})
    }
})
router.put('/organisations/update', async (req, res) => {
    const {name, invitationUrl, orgId} = req.body
    console.log(`Received orgId: ${orgId}, name: ${name}, invitationUrl: ${invitationUrl}`);
    try {
       if (name) {
        await prisma.organisation.update({
            where: {id: orgId},
            data: {name}
        })
       }
       
       if (invitationUrl) {
        await prisma.invitation.update({
            where: {organisationId: orgId},
            data: {url: invitationUrl}
        })
       }
       res.status(200).json({message: "successful", isSuccess: true})
    } catch (err) {
        console.log(err)
        res.status(400).json({message: err.message, isSuccess: false})
    }
})
router.post('/organisations/users/add', async (req, res) => {
    const {userId, orgId} = req.body
    try {
        const existingEntry = await prisma.userOrganisation.findUnique({
            where: {
                userId_organisationId: {
                    userId: userId,
                    organisationId: orgId
                }
            }
        });

        if (!existingEntry) {
            await prisma.userOrganisation.create({
                data: {
                    userId,
                    organisationId: orgId
                }
            })
            res.status(200).json({message: "User added successfully", isSuccess: true})
        } else {
            res.status(400).json({message: "User already exists in the organisation", isSuccess: false})
        }
    } catch (err) {
        res.status(500).json({message: err.message, isSuccess: false})
    }
})

router.delete('/organisations/:id', () => {})

/**
 * MESSAGES To be implemented later
 */
router.get('/messages/private', async (req, res) => {
    const receiverId = parseInt(req.query.receiverId);
    const senderId = parseInt(req.query.senderId);
    try {
        const messages = await prisma.message.findMany({
        where: {
            OR: [
            {
                AND: [
                { senderId: Number(senderId) },
                { recipientId: Number(receiverId) }
                ]
            },
            {
                AND: [
                { senderId: Number(receiverId) },
                { recipientId: Number(senderId) }
                ]
            }
            ]
        },
        include: {sender: true},
        orderBy: {
            createdAt: 'asc'
        }
    });
    const sanitizeMessages = messages.map(message => {
        delete message.sender.password;
        return message
    })
    res.status(200).json({messages: sanitizeMessages})
    } catch (err) {
        res.status(404).json({message: err.message})
    }
    
})

router.get('/messages/group', async (req, res) => {
    const departmentId = parseInt(req.query.departmentId);
    try {
        const messages = await prisma.message.findMany({
            where: {
                departmentId: departmentId
            },
            include: {sender: true},
            orderBy: {createdAt: 'asc'}
        });
        res.status(200).json({messages, isSuccess: true})
    } catch (err) {
        res.status(404).json({message: err.message, isSuccess: false})
    } 
})
router.post('/messages/group', async (req, res) => {
    const {senderId, content, departmentId} = req.body;
    try {
        const messageSent = await prisma.message.create({
            data: {
                senderId,
                content,
                departmentId,
            }
        })
        const messages = await prisma.message.findUnique({
            where: {
                id: messageSent.id
            },
            include: {sender: true}
        })
        delete messages.sender.password;
        res.status(200).json({message: "message sent successfully", isSuccess: true, messages})
    } catch (err) {
        console.log(err)
        res.status(400).json({message: err.message, isSuccess: false})
    }
})

router.post('/messages/new', async (req, res) => {
    const {senderId, recipientId, content} = req.body;
    try {
        const message = await prisma.message.create({
            data: {
                senderId,
                recipientId,
                content,
            }
        })
        res.status(200).json({message})
    } catch (err) {
        res.status(404).json({message: err.message})
    }
})

router.get('/users/chats', async (req, res) => {
  const { userId } = req.query;

  try {
    // Get all users that the given user has sent messages to or received messages from
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: parseInt(userId) },
          { recipientId: parseInt(userId) },
        ],
      },
      select: {
        senderId: true,
        recipientId: true,
      },
    });

    const chatPartners = Array.from(new Set(messages.flatMap(({ senderId, recipientId }) => [
        senderId === parseInt(userId) ? recipientId : senderId,
      ].filter(Boolean))));
      

    // Get the last message sent or received between the given user and each chat partner
    const lastMessagesPromises = chatPartners.map(async partnerId => {
      return await prisma.message.findFirst({
        where: {
          OR: [
            { AND: [{ senderId: parseInt(userId) }, { recipientId: partnerId }] },
            { AND: [{ senderId: partnerId }, { recipientId: parseInt(userId) }] },
          ],
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          sender: true,
          recipient: true,
        },
      });
    });

    let lastMessages = await Promise.all(lastMessagesPromises);
    // Sort conversations by the timestamp of the last message
    lastMessages = lastMessages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());


    res.json(lastMessages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});





export default router;