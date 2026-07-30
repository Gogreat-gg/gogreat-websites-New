import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

export const submitHealthScan = (data) => api.post("/health-scan", data).then((r) => r.data);
export const submitContact = (data) => api.post("/contact", data).then((r) => r.data);

export const WHATSAPP = "919566685075";
export const PHONE = "+91 95666 85075";
export const EMAIL = "hello@gogreat.in";
export const ADDRESS =
  "M.R.K. Mannar building (Ground Floor), South Dandapani Street, T.Nagar, Chennai – 600017";

export const SOCIALS = {
  linkedin: "https://www.linkedin.com/in/go-great-795035369/",
  instagram: "https://www.instagram.com/gogreat5577/",
  facebook: "https://www.facebook.com/profile.php?id=61590735893297",
  youtube: "https://www.youtube.com/@gogreatofficial",
};
