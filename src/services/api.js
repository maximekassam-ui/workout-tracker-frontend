const API_URL = "http://localhost:1337";

async function getCurrentWorkout(userToken) {
  try {
    // console.log(">>>>>>>>", `Bearer ${userToken}`);
    const response = await fetch(`${API_URL}/api/workouts/current`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    if (response.status === 404) {
      return null;
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error.message);
  }
}

async function login(identifier, password) {
  try {
    const response = await fetch(`${API_URL}/api/auth/local`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: identifier, password: password }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error.message);
  }
}

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

export { API_URL, getCurrentWorkout, login, getWorkoutHistory };
