export const getRefreshToken = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/auth/refresh-token`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    if (response.ok) {
      return true;
    } else {
      throw new Error("Error getting refresh token.");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
