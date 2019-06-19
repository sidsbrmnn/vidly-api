const config = require("config");
const express = require("express");
const { info } = require("winston");

const app = express();

require("./startup/logging")();
if (process.env.NODE_ENV === "production") require("./startup/prod")(app);
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

const port = process.env.PORT || config.get("port");
app.listen(port, () => info(`Listening on port ${port}`));
