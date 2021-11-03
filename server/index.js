const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

app.use("/", express.static(path.join(__dirname, "../public")));

app.get('/', (req, res) => {
  console.log('hello')
})

app.listen(port, () => {
  console.log("listening " + port);
})