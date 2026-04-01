const BASE_URL = "http://localhost:5000/api/cart";

export const fetchCart = async (token) => {
  const res = await fetch(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const addToCartApi = async (productId, qty = 1, token) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, qty }),
  });
  return res.json();
};

export const updateCartItemApi = async (itemId, qty, token) => {
  const res = await fetch(BASE_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ itemId, qty }),
  });
  return res.json();
};

export const removeCartItemApi = async (itemId, token) => {
  const res = await fetch(`http://localhost:5000/api/cart/${itemId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to remove cart item");
  }

  return res.json();
};

export const clearCartApi = async (token) => {
  const res = await fetch(BASE_URL, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to clear cart");
  }

  return res.json();
};
