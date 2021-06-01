const express = require("express");
const path = require("path");
const port = process.env.PORT || 3000;
const { routes } = require("./routes");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  next();
});
app.use("/", routes);
app.use(express.static(path.join(__dirname, "..", "public")));

app.listen(port, () => console.log("Listening on port", port));
