const API_URL = import.meta.env.VITE_API_URL;

const getCurrentWorkout = async (userToken) => {
  try {
    // console.log(">>>>>>>>", `Bearer ${userToken}`);
    const response = await fetch(`${API_URL}/api/workouts/current`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    // console.log(">>>>>>>>", `Bearer ${userToken}`);
    // console.log("STATUS :", response.status);

    if (response.status === 404) {
      return null;
    }

    const result = await response.json();

    console.log("RESULT :", result);

    return result;
  } catch (error) {
    console.log(error.message);
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

export { getCurrentWorkout, getWorkoutHistory };
