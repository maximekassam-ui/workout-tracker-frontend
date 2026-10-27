const API_URL = import.meta.env.VITE_API_URL;

const getCurrentWorkout = async (userToken) => {
  try {
    const response = await fetch(`${API_URL}/api/workouts/current`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error("Impossible de récupérer la séance en cours.");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
};

const getWorkoutHistory = async (userToken) => {
  try {
    const response = await fetch(`${API_URL}/api/workouts/history`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error.message);
  }
};

const startWorkout = async (userToken, workoutTemplateId) => {
  try {
    const response = await fetch(`${API_URL}/api/workouts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ workoutTemplateId: workoutTemplateId }),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message);
    }
    return result;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

export { getCurrentWorkout, getWorkoutHistory, startWorkout };
