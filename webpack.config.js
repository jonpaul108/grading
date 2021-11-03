const path = require("path");

module.exports = {
  mode: "development",
  entry: "./gradeUpdate/lib/index.js",
  target: "node",
  output: {
    path: path.resolve(__dirname, "./gradeUpdate/public"),
    filename: "main.js",
  },
};
