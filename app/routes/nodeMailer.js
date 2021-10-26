const router = require("express").Router();
const User = require("../models/userModel");

router.post("/", async (req, res) => {
  try {
    const user = await User.findOne({
      confirmationCode: req.body.confirmationCode,
    });
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    user.status = "Active";
    delete user.confirmationCode;
    const response = await user.save();
    if (response) {
      return res.status(200).send({ message: "Confirmed" });
    }
    return res.status(500).send({ message: "Internal server Error" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server Error" });
  }
});

module.exports = router;
