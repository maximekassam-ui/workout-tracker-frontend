import { API_URL } from "./api";

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

export { login, signUp };
