import "./db";
import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();
import "./models/Video.js";
import "./models/Comment.js";

const PORT = process.env.PORT || 4000;

const handleListening = () =>
  console.log(`✅ Listening on: http://localhost:${PORT}`);

app.listen(PORT, handleListening);
