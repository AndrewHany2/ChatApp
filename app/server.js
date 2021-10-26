require("dotenv").config();
const db = require("./helpers/dbConnection");
const express = require("express");
const conversationRoute = require("./routes/conversations");
const userRouter = require("./routes/user");
const messageRoute = require("./routes/messages");
const nodeMailerRoute = require("./routes/nodeMailer");
const app = express();
const http = require("http");
const redis = require("redis");
const server = http.createServer(app);
const { Server } = require("socket.io");
const morgan = require("morgan");
var bodyParser = require("body-parser");
const cors = require("cors");

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const client = redis.createClient(6379);
app.use(cors());
app.use(morgan("dev"));

db.connectDB();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/user", userRouter);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/confirm", nodeMailerRoute);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/build/public/index.html");
});

var chat_messages = [];

client.once("ready", function () {
  client.get("chat_app_messages", function (err, reply) {
    if (reply) {
      chat_messages = JSON.parse(reply);
    } else console.log(err);
  });
});

io.on("connection", (socket) => {
  console.log("a user connected");
  client.get("chat_app_messages", function (err, reply) {
    if (reply) {
      socket.emit("messages from cache", JSON.parse(reply));
    } else console.log(err);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
    chat_messages.push(msg);
    client.set("chat_app_messages", JSON.stringify(chat_messages));
  });
});

client.on("error", (error) => {
  console.error(error);
});

client.on("connect", function () {
  console.log("Connected!");
});

server.listen(4000, () => {
  console.log("listening on *:4000");
});
