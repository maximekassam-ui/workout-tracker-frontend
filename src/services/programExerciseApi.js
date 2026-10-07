import { API_URL } from "./api";

const createProgramExercise = async (
  numOfSets,
  minReps,
  maxReps,
  load,
  order,
  exerciseDocumentId,
  workoutTemplateDocumentId,
  userToken,
) => {
  try {
    const response = await fetch(`${API_URL}/api/program-exercises`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        data: {
          order: order,
          target_sets: numOfSets,
          target_reps_min: minReps,
          target_reps_max: maxReps,
          target_load: load,
          workout_template: workoutTemplateDocumentId,
          exercise: exerciseDocumentId,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.log(error);
      throw new Error("Erreur lors de la création de l'exercice");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
};

const getProgramExercise = async (programExerciseDocumentId, userToken) => {
  const response = await fetch(
    `${API_URL}/api/program-exercises/${programExerciseDocumentId}`,
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
  );

  const result = await response.json();
  return result;
};

const updateProgramExercise = async (
  programExerciseDocumentId,
  numOfSets,
  minReps,
  maxReps,
  load,
  userToken,
) => {
  try {
    const response = await fetch(
      `${API_URL}/api/program-exercises/${programExerciseDocumentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          data: {
            target_sets: numOfSets,
            target_reps_min: minReps,
            target_reps_max: maxReps,
            target_load: load,
          },
        }),
      },
    );

    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
};

const deleteProgramExercise = async (programExerciseDocumentId, usertoken) => {
  try {
    const response = await fetch(
      `${API_URL}/api/program-exercises/${programExerciseDocumentId}`,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${usertoken}`,
        },
      },
    );

    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
};

export {
  createProgramExercise,
  getProgramExercise,
  updateProgramExercise,
  deleteProgramExercise,
};
