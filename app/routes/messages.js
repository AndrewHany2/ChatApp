const router = require("express").Router();
const verifyUser = require("../middlewares/VerifyUser");
const Message = require("../models/Message");

//add
router.post("/", async (req, res) => {
  const newMessage = new Message({
    text: req.body.msg,
    conversationId: req.body.conversationId,
    sender: req.body.sender,
  });
  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get

router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
