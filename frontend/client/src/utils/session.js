// Match the rejected token so a delayed response cannot log out a new session.
export const expireSession = (token) => {
  if (!token || localStorage.getItem("token") !== token) return;

  localStorage.removeItem("token");
  localStorage.removeItem("cart");
  localStorage.removeItem("wishlist");
  window.location.replace("/auth?expired=1");
};
