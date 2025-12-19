import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/api/v1` 
  : "http://localhost:3000/api/v1";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Framework API calls
export const frameworkAPI = {
  // Get all framework presets
  getAllPresets: async (type = null) => {
    const params = type ? { type } : {};
    const response = await api.get("/framework", { params });
    return response.data;
  },

  // Get framework preset by ID
  getPresetById: async (id) => {
    const response = await api.get(`/framework/${id}`);
    return response.data;
  },

  // Create framework preset (admin only)
  createPreset: async (formData) => {
    const response = await api.post("/framework/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Update framework preset (admin only)
  updatePreset: async (id, formData) => {
    const response = await api.put(`/framework/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Delete framework preset (admin only)
  deletePreset: async (id) => {
    const response = await api.delete(`/framework/${id}`);
    return response.data;
  },

  // Toggle framework lock (admin only)
  toggleLock: async (id) => {
    const response = await api.patch(`/framework/${id}/toggle-lock`);
    return response.data;
  },
};

// Project API calls
export const projectAPI = {
  // Get all projects of the user
  getUserProjects: async (page = 1, limit = 6) => {
    const response = await api.get("/projects", {
      params: { page, limit },
    });
    return response.data;
  },

  // Get single project with deployments
  getProjectById: async (projectId, page = 1, limit = 10) => {
    const response = await api.get(`/projects/${projectId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Create project
  createProject: async (data) => {
    const response = await api.post("/projects/create", data);
    return response.data;
  },

  // Deploy project
  deployProject: async (projectId) => {
    const response = await api.post(`/projects/${projectId}/deploy`);
    return response.data;
  },

  // Redeploy project (creates new deployment)
  redeployProject: async (projectId) => {
    const response = await api.post(`/projects/${projectId}/redeploy`);
    return response.data;
  },

  // Get deployment status
  getDeploymentStatus: async (deploymentId) => {
    const response = await api.get(`/projects/deployments/${deploymentId}/status`);
    return response.data;
  },

  // Get deployment logs
  getDeploymentLogs: async (deploymentId) => {
    const response = await api.get(`/projects/deployments/${deploymentId}/logs`);
    return response.data;
  },

  // Delete deployment
  deleteDeployment: async (deploymentId) => {
    const response = await api.delete(`/projects/deployments/${deploymentId}`);
    return response.data;
  },

  // Delete project
  deleteProject: async (projectId) => {
    const response = await api.delete(`/projects/${projectId}`);
    return response.data;
  },

  // Update project
  updateProject: async (projectId, data) => {
    const response = await api.put(`/projects/${projectId}`, data);
    return response.data;
  },

  // Custom domain operations
  addCustomDomain: async (projectId, customDomain) => {
    const response = await api.post(`/projects/${projectId}/custom-domain`, { customDomain });
    return response.data;
  },

  removeCustomDomain: async (projectId) => {
    const response = await api.delete(`/projects/${projectId}/custom-domain`);
    return response.data;
  },

  verifyCustomDomain: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/custom-domain/verify`);
    return response.data;
  },
};

// GitHub API calls
export const githubAPI = {
  // Check if GitHub is connected
  checkConnection: async () => {
    const response = await api.get("/github/connected");
    return response.data;
  },

  // Get GitHub repositories
  getRepositories: async (includePrivate = true) => {
    const response = await api.get("/github/repos", {
      params: { includePrivate: includePrivate.toString() },
    });
    return response.data;
  },

  // Get GitHub OAuth URL for linking account
  getOAuthUrl: async (callbackURL) => {
    const response = await api.get("/github/oauth-url", {
      params: { callbackURL },
    });
    return response.data;
  },

  // Disconnect GitHub account
  disconnect: async () => {
    const response = await api.delete("/github/disconnect");
    return response.data;
  },

  // Check if GitHub account is available for linking
  checkAccountAvailability: async (githubAccountId) => {
    const response = await api.get("/github/check-availability", {
      params: { githubAccountId },
    });
    return response.data;
  },
};

// Webhook API calls
export const webhookAPI = {
  // Create webhook for a project
  createWebhook: async (projectId) => {
    const response = await api.post(`/webhooks/projects/${projectId}/create`);
    return response.data;
  },

  // Delete webhook for a project
  deleteWebhook: async (projectId) => {
    const response = await api.delete(`/webhooks/projects/${projectId}`);
    return response.data;
  },
};

// User API calls (Admin only)
export const userAPI = {
  // Get all users with pagination
  getUsers: async (page = 1, limit = 10) => {
    const response = await api.get("/users", {
      params: { page, limit },
    });
    return response.data;
  },

  // Update user role
  updateUserRole: async (userId, role) => {
    const response = await api.patch(`/users/${userId}/role`, { role });
    return response.data;
  },
};

export default api;