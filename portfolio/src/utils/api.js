// API configuration utility
const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_PRODUCTION_API_URL || 'https://codeawakening.onrender.com';

export const API_ENDPOINTS = {
  // User endpoints
  USER_ME: `${API_BASE_URL}/api/v1/user/me`,
  USER_PORTFOLIO: `${API_BASE_URL}/api/v1/user/me/portfolio`,
  
  // Project endpoints
  PROJECTS_GET_ALL: `${API_BASE_URL}/api/v1/project/getall`,
  PROJECT_GET: (id) => `${API_BASE_URL}/api/v1/project/get/${id}`,
  
  // Timeline endpoints
  TIMELINE_GET_ALL: `${API_BASE_URL}/api/v1/timeline/getall`,
  
  // Skills endpoints
  SKILLS_GET_ALL: `${API_BASE_URL}/api/v1/skill/getall`,
  
  // Software applications endpoints
  SOFTWARE_APPS_GET_ALL: `${API_BASE_URL}/api/v1/softwareapplication/getall`,
  
  // Message endpoints
  MESSAGE_SEND: `${API_BASE_URL}/api/v1/message/send`,
};

export default API_BASE_URL;