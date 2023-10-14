export const host = 'https://swiichbackend.onrender.com';
export const serverConnectionStatus = `${host}/`;

// AUTH APIs
export const registerRoute = `${host}/register`;
export const loginRoute = `${host}/login`;
export const checkEmailRoute = `${host}/emailcheck`;
export const verifyOtpRoute = `${host}/verifyotp`;
export const invitationDetailsRoute = `${host}/invitationcode`;
export const createNewOrganizationRoute = `${host}/api/organisation/new`;

// DEPARTMEN APIs
export const createNewDepartmentRoute = `${host}/api/departments/new`;
export const addUsersToDepartmentRoute = `${host}/api/departments/join`;

// ORGANIZATION APIs
export const addUserToOrganizationRoute = `${host}/api/organisations/users/add`;
export const getOrganizationByIdRoute = `${host}/api/organisations/`;
export const getUsersByOrganizationIdRoute = `${host}/api/organisations/users`;
export const createOrganizationInviteCodeRoute = `${host}/api/organisations/invitation/create`;
export const updateOrganizationInfoRoute = `${host}/api/organisations/update`;

// MESSAGE APIs
export const getDirectMessagesRoute = `${host}/api/users/chats`;
export const getPrivateMessagesRoute = `${host}/api/messages/private`;
export const sendDirectMessagesRoute = `${host}/api/messages/new`;
export const getGroupMessagesRoute = `${host}/api/messages/group`;
export const sendGroupMessagesRoute = `${host}/api/messages/group`;

// TASK APIs
export const getTaskListRoute = `${host}/api/tasks`;
export const getTaskByIdRoute = `${host}/api/tasks`;
export const createTaskRoute = `${host}/api/tasks/create`;
export const updateTaskRoute = `${host}/api/task`;
export const deleteTaskRoute = `${host}/api/task`;
