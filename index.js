const express = require("express");
const app = express();
app.use(express.json());
const port = 8075;
const userroute = require("./routes/users");
const bookroute = require("./routes/books");

app.get("/", (req, res) => {
  res.status(200).json({
    message: `server is running on port : ${port}`,
  });
});

app.use("/users", userroute);
app.use("/books", bookroute);

app.get("*", (req, res) => {
  res.status(404).json({
    message: "No Page Found",
  });
});

app.listen(port, () => {
  console.log(`node.js server is running on port : ${port}`);
});
