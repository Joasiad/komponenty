require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 Połączenie z MongoDB Atlas
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// ROUTES
app.use("/api/workouts", require("./routes/workoutRoutes"));
app.use("/api/exercises", require("./routes/exerciseRoutes"));

app.listen(5000, () => console.log("Server running on port 5000"));
