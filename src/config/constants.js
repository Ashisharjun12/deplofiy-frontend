// Production domain configuration
export const PRODUCTION_DOMAIN = import.meta.env.VITE_PRODUCTION_DOMAIN || 'deplofy.cloud';
export const USE_HTTPS = import.meta.env.VITE_USE_HTTPS !== 'false'; // Default to true for production

/**
 * Get the deployment URL for a subdomain
 * @param {string} subDomain - The subdomain
 * @returns {string} The full deployment URL
 */
export const getDeploymentUrl = (subDomain) => {
  if (!subDomain) return null;
  const protocol = USE_HTTPS ? 'https' : 'http';
  return `${protocol}://${subDomain}.${PRODUCTION_DOMAIN}`;
};

/**
 * Get the deployment URL display text
 * @param {string} subDomain - The subdomain
 * @returns {string} The display text
 */
export const getDeploymentUrlText = (subDomain) => {
  if (!subDomain) return null;
  return `${subDomain}.${PRODUCTION_DOMAIN}`;
};

