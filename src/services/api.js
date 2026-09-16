const API_URL = "http://localhost:1337";

const getCurrentWorkout = async (userToken) => {
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
};

const login = async (identifier, password) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/local`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: identifier, password: password }),
    });
    const result = await response.json();
    if (response.ok) {
      return result;
    } else {
      console.log(result);

      throw new Error(result.error.message);
    }
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

const signUp = async (identifier, password, username) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/local/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: identifier,
        password: password,
        username: username,
      }),
    });
    const result = await response.json();

    if (response.ok) {
      return result;
    } else {
      console.log(result);

      throw new Error(result.error.message);
    }
  } catch (error) {
    console.log(error);
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

const getCurrentUser = async (userToken) => {
  try {
    const response = await fetch(`${API_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error.message);
  }
};

export {
  API_URL,
  getCurrentWorkout,
  login,
  signUp,
  getWorkoutHistory,
  getCurrentUser,
};
