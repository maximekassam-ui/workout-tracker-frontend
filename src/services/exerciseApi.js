import { API_URL } from "./api";
import qs from "qs";

const getExercise = async (documentId, userToken) => {
  try {
    const response = await fetch(
      `${API_URL}/api/exercises/${documentId}?populate=*`,
      {
        headers: { Authorization: `Bearer ${userToken}` },
      },
    );

    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
};

const getExercises = async (userToken) => {
  try {
    const response = await fetch(`${API_URL}/api/exercises?populate=*`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
};

const getExercisesWithMuscle = async (userToken) => {
  try {
    const query = qs.stringify(
      {
        populate: {
          image: true,

          exercise_muscles: {
            populate: ["muscle"],
          },
        },
      },
      {
        encodeValuesOnly: true,
      },
    );

    const response = await fetch(`${API_URL}/api/exercises?${query}`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
};

export { getExercise, getExercises, getExercisesWithMuscle };
