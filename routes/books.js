const express = require("express");
const { books } = require("../data/books.json");
const { users } = require("../data/users.json");
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

router.post("/", (req, res) => {
  const { data } = req.body;
  const book = books.find((each) => each.id === data.id);
  if (book) {
    return res.status(409).json({
      success: false,
      message: "book already exist with this ID.",
    });
  }
  books.push({ ...data });
  return res.status(200).json({
    success: true,
    data: books,
  });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { data } = req.body;
  const book = books.find((each) => each.id === data.id);
  if (!book) {
    return res.status(404).json({
      success: false,
      message: "book not found",
    });
  }
  const updatedbook = books.map((each) => {
    if (each.id === id) {
      return { ...each, ...data };
    }
    return each;
  });
  res.status(200).json({
    success: true,
    data: updatedbook,
  });
});

router.get("/issuedbook/byuser", (req, res) => {
  const user = users.filter((each) => {
    if (each.issuedBook) return each;
  });
  const issuedBook = [];
  user.map((walk) => {
    const book = books.find((each) => {
      if (each.id === walk.issuedBook) {
        issuedBook.push(each);
        each.issueby = walk.name;
        each.issuedate = walk.issuedDate;
        each.returndate = walk.returnDate;
      }
    });
  });

  if (issuedBook.length === 0) {
    return res.status(404).json({
      success: false,
      message: "no isseued book",
    });
  }
  res.status(200).json({
    success: true,
    data: issuedBook,
  });
});

router.get("/issuedbooks/fine", (req, res) => {
  const user = users.filter((each) => {
    if (each.issuedBook) return each;
  });
  console.log(user);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "not found issued book",
    });
  }

  const issuedbookwithfine = [];

  const dateindays = (data = "") => {
    let date;
    if (data === "") {
      date = new Date();
    } else {
      date = new Date(data);
    }
    let days = Math.floor(date / (1000 * 60 * 60 * 24));
    return days;
  };
  user.map((each) => {
    const booke = books.find((book) => {
      if (book.id === each.issuedBook) {
        let currentdate = dateindays();
        let returndate = dateindays(each.returnDate);
        if (returndate <= currentdate) {
          issuedbookwithfine.push(book);
        }
      }
    });
  });
  if (issuedbookwithfine.length === 0) {
    return res.status(404).json({ success: false, message: "no book found" });
  }
  res.status(200).json({
    success: true,
    data: issuedbookwithfine,
  });
});

module.exports = router;
