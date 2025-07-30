import axios from "axios";

//https://apipythonml.onrender.com
export const apiFC43 = axios.create({
  baseURL: "https://apip.samivps.site",
  headers: {
    Authorization: "5a206a5576b8bbc1092c0b204e71b98ceb8528e2",
  },
});

export const apiGPT = axios.create({
  baseURL: "https://api.openai.com/v1",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer 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`,
  },
});
