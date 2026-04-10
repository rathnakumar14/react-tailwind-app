const BASE_URL = "https://jsonplaceholder.typicode.com/posts";

// ✅ GET
export const getCards = async () => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch cards");
  return res.json();
};

// ✅ POST
export const createCard = async (card) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(card)
  });

  if (!res.ok) throw new Error("Failed to create card");
  return res.json();
};

// ✅ PUT
export const updateCard = async (id, card) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(card)
  });

  if (!res.ok) throw new Error("Failed to update card");
  return res.json();
};

// ✅ DELETE
export const deleteCard = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE"
  });

  if (!res.ok) throw new Error("Failed to delete card");
  return true;
};