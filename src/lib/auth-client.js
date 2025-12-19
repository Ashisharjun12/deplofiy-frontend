import { createAuthClient } from "better-auth/react";

export const config = {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL 
      ? `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth`
      : 'http://localhost:3000/api/v1/auth',
    APP_NAME: 'deplofiy',
  };

export const authClient = createAuthClient({
  baseURL: config.API_BASE_URL,
  fetchOptions: {
    credentials: "include"
  }
});



// Export authClient as default
export default authClient;

// Export specific methods for easier use
export const { 
  signIn, 
  signUp, 
  signOut, 
  useSession,
  getSession,
  linkSocial,
  unlinkAccount
} = authClient;