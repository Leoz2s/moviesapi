require('express-async-errors');
const AppError = require("./utils/AppError.js");

const express = require("express");
const app = express();
app.use(express.json());

// const uploadConfig = require("./configs/upload");
// app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

const cors = require("cors");
app.use(cors());

const migrationsRun = require("./database/migrations");

const PORT = 3333;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));

const routes = require("./routes");
app.use(routes);

app.use((error, request, response, next) => {
  if(error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    });
  };

  console.error(error);

  return response.status(500).json({
    status: "error",
    message: "Internal server error"
  });
});

migrationsRun();
