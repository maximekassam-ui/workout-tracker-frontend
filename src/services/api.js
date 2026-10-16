const API_URL = import.meta.env.VITE_API_URL;
import qs from "qs";

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

const getMuscles = async () => {
  try {
    const response = await fetch(`${API_URL}/api/muscles?populate=*`);

    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      throw new Error("La récupération des muscles a échoué");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getMuscle = async (muscleId) => {
  try {
    const query = qs.stringify(
      {
        populate: {
          image: true,
          exercise_muscles: {
            populate: {
              exercise: { populate: { image: true, categories: true } },
            },
          },
        },
      },
      { encodeValuesOnly: true },
    );

    const response = await fetch(`${API_URL}/api/muscles/${muscleId}?${query}`);

    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      throw new Error("La récupération des muscles a échoué");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { API_URL, getCurrentUser, getMuscles, getMuscle };
