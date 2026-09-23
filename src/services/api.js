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
    const response = await fetch(`${API_URL}/api/users/me?populate=programs`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error.message);
  }
};

const createProgram = async (name, description, is_active, userToken) => {
  try {
    const response = await fetch(
      `${API_URL}/api/programs`,

      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          data: {
            name: name,
            description: description,
            is_active: is_active,
          },
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      console.log(error);
      throw new Error("Erreur lors de la création du programme");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getProgram = async (programId, userToken) => {
  try {
    const response = await fetch(
      `${API_URL}/api/programs/${programId}?populate[workout_templates][populate]=*`,
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

export {
  API_URL,
  getCurrentWorkout,
  login,
  signUp,
  getWorkoutHistory,
  getCurrentUser,
  createProgram,
  getProgram,
};
