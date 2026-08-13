import axios from "axios";
import { API_BASE_URL } from "./base";

const NEWSLETTER_URL = `${API_BASE_URL}/newsletter`;

export const subscribeNewsletter = async (email, source = "footer") => {
  const { data } = await axios.post(`${NEWSLETTER_URL}/subscribe`, { email, source });
  return data;
};

export const unsubscribeNewsletter = async ({ token, email } = {}) => {
  const { data } = await axios.post(`${NEWSLETTER_URL}/unsubscribe`, { token, email });
  return data;
};

export const getNewsletterStatus = async (token) => {
  const { data } = await axios.get(`${NEWSLETTER_URL}/status`, { params: { token } });
  return data;
};
