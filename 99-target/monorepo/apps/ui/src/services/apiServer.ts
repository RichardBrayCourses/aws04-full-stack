import { config } from "../config";

export const checkApiServerHealth = async () => {
  const response = await fetch(`${config.apiBaseUrl}/health`);

  if (!response.ok) {
    return false;
  }

  const body = await response.text();
  return body.trim() === "Healthy!";
};
