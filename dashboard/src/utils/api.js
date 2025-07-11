// API configuration utility
const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_PRODUCTION_API_URL || 'https://codeawakening.onrender.com';

export const API_ENDPOINTS = {
  // User endpoints
  USER_LOGIN: `${API_BASE_URL}/api/v1/user/login`,
  USER_ME: `${API_BASE_URL}/api/v1/user/me`,
  USER_LOGOUT: `${API_BASE_URL}/api/v1/user/logout`,
  USER_UPDATE_PASSWORD: `${API_BASE_URL}/api/v1/user/password/update`,
  USER_UPDATE_PROFILE: `${API_BASE_URL}/api/v1/user/me/profile/update`,
  USER_FORGOT_PASSWORD: `${API_BASE_URL}/api/v1/user/password/forgot`,
  USER_RESET_PASSWORD: (token) => `${API_BASE_URL}/api/v1/user/password/reset/${token}`,
  
  // Project endpoints
  PROJECTS_GET_ALL: `${API_BASE_URL}/api/v1/project/getall`,
  PROJECT_GET: (id) => `${API_BASE_URL}/api/v1/project/get/${id}`,
  PROJECT_ADD: `${API_BASE_URL}/api/v1/project/add`,
  PROJECT_UPDATE: (id) => `${API_BASE_URL}/api/v1/project/update/${id}`,
  PROJECT_DELETE: (id) => `${API_BASE_URL}/api/v1/project/delete/${id}`,
  
  // Timeline endpoints
  TIMELINE_GET_ALL: `${API_BASE_URL}/api/v1/timeline/getall`,
  TIMELINE_ADD: `${API_BASE_URL}/api/v1/timeline/add`,
  TIMELINE_DELETE: (id) => `${API_BASE_URL}/api/v1/timeline/delete/${id}`,
  
  // Skills endpoints
  SKILLS_GET_ALL: `${API_BASE_URL}/api/v1/skill/getall`,
  SKILL_ADD: `${API_BASE_URL}/api/v1/skill/add`,
  SKILL_UPDATE: (id) => `${API_BASE_URL}/api/v1/skill/update/${id}`,
  SKILL_DELETE: (id) => `${API_BASE_URL}/api/v1/skill/delete/${id}`,
  
  // Software applications endpoints
  SOFTWARE_APPS_GET_ALL: `${API_BASE_URL}/api/v1/softwareapplication/getall`,
  SOFTWARE_APP_ADD: `${API_BASE_URL}/api/v1/softwareapplication/add`,
  SOFTWARE_APP_DELETE: (id) => `${API_BASE_URL}/api/v1/softwareapplication/delete/${id}`,
  
  // Message endpoints
  MESSAGES_GET_ALL: `${API_BASE_URL}/api/v1/message/getall`,
  MESSAGE_DELETE: (id) => `${API_BASE_URL}/api/v1/message/delete/${id}`,
};

export default API_BASE_URL;