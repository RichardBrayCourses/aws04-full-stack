export const checkApiServerHealth = async () => {
  const response = await fetch(`http://localhost:3001/health`);

  if (!response.ok) {
    return false;
  }

  const body = await response.text();
  return body.trim() === "Healthy!";
};
