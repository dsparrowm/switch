import { z } from "zod";

/**
 * @openapi
 * components:
 *   schemas:
 *     createDepartmentSchema:
 *       type: object
 *       properties:
 *         userId:
 *           type: number
 *           minimum: 1
 *         departmentName:
 *           type: string
 *           minLength: 1
 *         orgId:
 *           type: number
 *           minimum: 1
 *     joinDepartmentSchema:
 *       type: object
 *       properties:
 *         userIds:
 *           type: array
 *           items:
 *             type: number
 *             minimum: 1
 *         adminOrDeptHeadId:
 *           type: number
 *           minimum: 1
 *         departmentId:
 *           type: number
 *           minimum: 1
 *     createTaskSchema:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
 *         createdBy:
 *           type: number
 *           minimum: 1
 *     updateTaskSchema:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           minimum: 1
 *         newTitle:
 *           type: string
 *           minLength: 1
 *         description:
 *           type: string
 *           nullable: true
 *         dueDate:
 *           type: string
 *           format: date
 *           nullable: true
 *         assignedTo:
 *           type: number
 *           minimum: 1
 *           nullable: true
 *         status:
 *           type: string
 *           enum:
 *             - PENDING
 *             - COMPLETED
 *     getOrganisationSchema:
 *       type: object
 *       properties:
 *         orgId:
 *           type: number
 *           minimum: 1
 *     createOrganisationSchema:
 *       type: object
 *       properties:
 *         userId:
 *           type: number
 *           minimum: 1
 *         name:
 *           type: string
 *           minLength: 1
 *     addUserToOrganisationSchema:
 *       type: object
 *       properties:
 *         userId:
 *           type: number
 *           minimum: 1
 *         orgId:
 *           type: number
 *           minimum: 1
 *     createOrgIviteSchema:
 *       type: object
 *       properties:
 *         organisationId:
 *           type: number
 *           minimum: 1
 *         userId:
 *           type: number
 *           minimum: 1
 *     getTasksSchema:
 *       type: object
 *       properties:
 *         userId:
 *           type: number
 *           minimum: 1
 */


// Zod Input validation schemas
export const signupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const verifyOtpSchema = z.object({
  userId: z.number().positive(),
  otp: z.string().min(6),
})

export const createDepartmentSchema = z.object({
    userId: z.number().positive(),
    departmentName: z.string().min(1),
    organisationId: z.number().positive(),
  });
  
export const joinDepartmentSchema = z.object({
  userIds: z.array(z.number().positive()),
  adminOrDeptHeadId: z.number().positive(),
  departmentId: z.number().positive(),
});

export const getDepartmentsSchema = z.object({
  organisationId: z.coerce.number().positive(),
});

export const getDepartmentUsersSchema = z.object({
  departmentId: z.coerce.number().int().positive(),
});

export const deleteDepartmentSchema = z.object({
  departmentId: z.number().positive(),
  organisationId: z.number().positive()
});

export const getDepartmentSchema = z.object({
  departmentId: z.coerce.number().positive(),
  organisationId: z.coerce.number().positive()
});

export const updateDepartmentSchema = z.object({
  departmentId: z.number().positive(),
  departmentName: z.string().min(1),
  organisationId: z.number().positive()
})
  
export const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  assignedUsers: z.array(z.string().email()).optional(),
  projectId: z.number().positive().optional(),
  deadline: z.date().optional(),
  checklists: z.array(z.object({
    title: z.string(),
    assignedTo: z.string().email().optional(),
  })).optional(),
});
  
export const updateTaskSchema = z.object({
  id: z.number().positive(),
  newTitle: z.string().min(1),
  description: z.string().min(1).optional(),
  deadline: z.date().optional(),
  assignedTo: z.number().positive().optional(),
  status: z.string().optional(),
  // z.enum(['PENDING', 'COMPLETED']).optional(),
});

export const getOrganisationSchema = z.object({
  orgId: z.coerce.number().int().positive(),
});

export const createOrganisationSchema = z.object({
  userId: z.number().positive(),
  name: z.string().min(1),
  users: z.array(z.string().email()).optional(),
});
  
export const addUserToOrganisationSchema = z.object({
  userId: z.number().positive(),
  organisationId: z.number().positive(),
});

export const getOrganisationUsersSchema = z.object({
  organisationId: z.coerce.number().int().positive()
})

export const updateOrganisationSchema = z.object({
  orgId: z.number().positive(),
  name: z.string().min(1).optional(),
  invitationUrl: z.string().optional(),
});
  
export const createOrgIviteSchema = z.object({
  organisationId: z.number().positive(),
  userId: z.number().positive(),
});

export const deleteOrganisationSchema = z.object({
  orgId: z.coerce.number().int().positive()
})

export const getUserTaskSchema = z.object({
  userId: z.coerce.number().int().positive(),
});

export const getTaskSchema = z.object({
  taskId: z.coerce.number().int().positive(),
});

export const assignTaskSchema = z.object({
  taskId: z.number().positive(),
  assignedUsers: z.array(z.string().email()).optional()
});

export const unAssignTaskSchema = z.object({
  taskId: z.number().positive(),
})

export const deleteTaskSchema = z.object({
  taskId: z.number().positive(),
});

export const getPrivateMessageSchema = z.object({
  receiverId: z.coerce.number().int().positive(),
  senderId: z.coerce.number().int().positive(),
});

export const getGroupMessageSchema = z.object({
  departmentId: z.coerce.number().int().positive(),
});

export const deleteMessageSchema = z.object({
  messageId: z.coerce.number().positive(),
});

export const createGroupMessageSchema = z.object({
  senderId: z.number().positive(),
  content: z.string().min(1),
  departmentId: z.number().positive()
});

export const createPrivateMessageSchema = z.object({
  senderId: z.number().positive(),
  recipientId: z.number().positive(),
  content: z.string().min(1),
});

export const getUserMessageSchema = z.object({
  userId: z.coerce.number().positive()
})

export const createProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  organisationId: z.number().positive(),
  memberEmails: z.array(z.string().email()).optional(),
});

export const getProjectSchema = z.object({
  projectId: z.coerce.number().int().positive(),
})

export const addProjectMembersSchema = z.object({
  projectId: z.number().positive(),
  memberEmails: z.array(z.string().email())
});