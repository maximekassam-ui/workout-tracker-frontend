import { API_URL } from "./api";

const getProgram = async (programId, userToken) => {
  try {
    const response = await fetch(`${API_URL}/api/programs/${programId}`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
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

    const result = await response.json();
    console.log("Réponse API création :", result);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { getProgram, createProgram };
