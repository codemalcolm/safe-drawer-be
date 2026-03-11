const express = require("express");
const uidsRouter = require("./routes/uids");
const BadRequestError = require("./errors/bad-request");

require("dotenv").config();

const app = express();
app.use(express.json());
const port = process.env.PORT | 3000;

app.get("/api/v1/hello", (req, res) => {
  res.json({ message: "Hello from be" });
});

app.use("/api/v1/uids", uidsRouter);
app.use("/api/v1/logs", logsRouter);

// Start the server
const start = async () => {
  try {
    // await connectDB function here
    console.log("DB connected");
    app.listen(port, () => {
      console.log(
        `Express Backend running on port http://localhost:${port}...`,
      );
    });
  } catch (error) {
    console.log(error);
  }
};

start();
