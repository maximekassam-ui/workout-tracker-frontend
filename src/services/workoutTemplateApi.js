import { API_URL } from "./api";

const createWorkoutTemplate = async (
  name,
  category,
  description,
  documentId,
  userToken,
) => {
  try {
    const response = await fetch(`${API_URL}/api/workout-templates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        data: {
          name: name,
          category: category,
          description: description,
          documentId: documentId,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.log(error);
      throw new Error("Erreur lors de la création de la séance");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
};

const getWorkoutTemplate = async (workoutTemplateId, userToken) => {
  try {
    const response = await fetch(
      `${API_URL}/api/workout-templates/${workoutTemplateId}?populate[program_exercises][populate]=exercise`,
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

export { createWorkoutTemplate, getWorkoutTemplate };
