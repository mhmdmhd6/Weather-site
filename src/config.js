require("dotenv").config();

// Other code follows
export const apiKey = process.env.API_KEY;
const debugMode = process.env.DEBUG === "true";
