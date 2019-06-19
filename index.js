const config = require("config");
const express = require("express");
const { info } = require("winston");

const app = express();

require("./startup/logging")();
require("./startup/config")();
require("./startup/validation")();
require("./startup/db")();
if (process.env.NODE_ENV === "production") require("./startup/prod")(app);
require("./startup/routes")(app);

const port = process.env.PORT || config.get("port");
app.listen(port, () => info(`Listening on port ${port}`));
