const router = require("express").Router();
const Conversation = require("../models/Conversation");
const User = require("../models/userModel");

//new conv

router.post("/", async (req, res) => {
  try {
    const receiver = await User.findOne({ email: req.body.receiverEmail });
    if (!receiver) {
      return res
        .status(404)
        .send({ message: "User Not Found, try anthor one" });
    }
    const newConversation = new Conversation({
      members: [req.body.senderId, receiver._id],
    });
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//get conv of a user

router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    }).populate("members");
    res.status(200).json(conversation);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get conv includes two userId

router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
