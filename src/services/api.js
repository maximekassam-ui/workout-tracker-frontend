const API_URL = import.meta.env.VITE_API_URL;

const getCurrentUser = async (userToken) => {
  try {
    const response = await fetch(
      `${API_URL}/api/users/me?populate[programs][populate]=*`,
      {
        headers: { Authorization: `Bearer ${userToken}` },
      },
    );

    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error.message);
  }
};

export { API_URL, getCurrentUser };
