const express = require("express");
const { books } = require("../data/books.json");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    data: books,
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const book = books.find((each) => each.id === id);
  if (!book)
    return res.status(404).json({ success: false, message: "book not found" });
  return res.status(200).json({
    success: true,
    data: book,
  });
});

module.exports = router;
