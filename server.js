const express = require("express");
const mongoose = require("mongoose");
const chalk = require("chalk")
const users = require('./routes/users');
const cards = require('./routes/cards');
const morgan = require("morgan");
const app = express();
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 9000;
mongoose.connect(process.env.DB_ATLAS || process.env.DB_LOCAL)
    .then(() => console.log(chalk.magenta("MongoDB connected")))
    .catch((error) => console.log(error));

app.use(cors());

app.use(express.json());

app.use(morgan(':date[iso] :method :url :status :response-time ms'));

app.use("/api/users", users);
app.use("/api/cards", cards);

app.listen(port, () => console.log(chalk.cyan(`server is running on port ${port}`)));