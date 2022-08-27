const express = require("express");
const { users } = require("../data/users.json");
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

module.exports = router;
