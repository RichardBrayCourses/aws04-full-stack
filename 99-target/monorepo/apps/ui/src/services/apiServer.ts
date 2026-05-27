const apiServerUrl = import.meta.env.VITE_API_SERVER_LOCAL;

export const getApiServerUrl = () => apiServerUrl;

export const checkApiServerHealth = async () => {
  const response = await fetch(`${apiServerUrl}/health`);

  if (!response.ok) {
    return false;
  }

  const body = await response.text();
  return body.trim() === "Healthy!";
};
