const express = require("express");
const { users } = require("../data/users.json");
const { books } = require("../data/books.json");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    data: users,
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const userbyID = users.find((each) => each.id === id);
  if (!userbyID) {
    return res.status(404).json({
      success: false,
      message: "user not found",
    });
  }
  return res.status(200).json({
    succuss: true,
    data: userbyID,
  });
});

router.post("/", (req, res) => {
  const { data } = req.body;
  const user = users.find((each) => each.id === data.id);
  if (user) {
    return res.status(409).json({
      success: false,
      message: "User already exist",
    });
  }
  users.push({ ...data });
  return res.status(200).json({
    success: true,
    data: users,
  });
});

router.put("/:id", (req, res) => {
  const { data } = req.body;
  const { id } = req.params;
  const user = users.find((each) => each.id === id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "user not found",
    });
  }
  const updatedusers = users.map((each) => {
    if (each.id === id) {
      return {
        ...each,
        ...data,
      };
    }
    return each;
  });
  return res.status(200).json({
    success: true,
    data: updatedusers,
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((each) => each.id === id);
  if (!user)
    return res.status(404).json({ success: false, message: "user not found" });
  const index = users.indexOf(user);
  users.splice(index, 1);
  return res.status(200).json({
    success: true,
    data: users,
  });
});
router.get("/subscription/details/:id", (req, res) => {
  const { id } = req.params;

  const user = users.find((each) => each.id === id && each.subscriptionDate);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "user not found with subscription",
    });
  }
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
  const subscriptiontype = (date) => {
    if (user.subscriptionType === "Basic") {
      date = date + 90;
    } else if (user.subscriptionType === "Standard") {
      date = date + 180;
    } else {
      date = date + 365;
    }
    return date;
  };
  let returndate = dateindays(user.returnDate);
  let currentdate = dateindays();
  let subscriptiondate = dateindays(user.subscriptionDate);
  let subscriptionexpire = subscriptiontype(subscriptiondate);

  const data = {
    ...user,
    subscriptionExpired: subscriptionexpire < currentdate,
    Daysleft:
      subscriptionexpire <= currentdate ? 0 : subscriptionexpire - currentdate,
    fine:
      returndate < currentdate
        ? subscriptionexpire <= currentdate
          ? 200
          : 100
        : 0,
  };
  res.status(200).json({
    success: true,
    data,
  });
});

module.exports = router;
