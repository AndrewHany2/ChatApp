import React, { Component } from "react";
import io from "socket.io-client";
import axios from "axios";

export default class chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: "",
      msgs: [],
      email: "",
      emailStatus: false,
      conversations: [],
      currentConv: "",
    };
    this.socket = io("http://localhost:4000");
  }
  componentDidMount() {
    if (!localStorage.getItem("userData")) {
      this.props.history.push("/sign-in");
    }
    const getConversations = async () => {
      try {
        const res = await axios.get(
          "api/conversations/" +
            JSON.parse(localStorage.getItem("userData")).userId
        );
        if (res) {
          this.setState({ conversations: res.data });
        }
      } catch (error) {
        console.log(error);
      }
    };
    getConversations();
    this.socket.on("chat message", (msg) => {
      let temp = this.state.msgs;
      temp.push(msg);
      this.setState({ msgs: temp });
    });
  }
  getMessages(c) {
    console.log(c);
    axios.get("/api/messages/" + c._id).then((res) => {
      let temp = [];
      for (const c of res.data) {
        temp.push(c.text);
      }
      this.setState({ msgs: temp });
    });
  }
  user = JSON.parse(localStorage.getItem("userData"));
  render() {
    return (
      <div>
        <div style={{ left: 0, paddingTop: "120px", position: "absolute" }}>
          <ul className="list-group">
            {this.state.conversations.map((c) => {
              return (
                <li
                  className="list-group-item"
                  onClick={() => {
                    this.setState({ emailStatus: true, currentConv: c });
                    this.getMessages(c);
                  }}
                >
                  {c.members[1].email}
                </li>
              );
            })}
          </ul>
        </div>
        {!this.state.emailStatus ? (
          <div style={{ width: "50%", marginLeft: "50%", paddingTop: "5%" }}>
            <div className="mx-auto">
              <div class="input-group mb-3">
                <input
                  type="text"
                  class="form-control"
                  placeholder="enter email you want to chat with"
                  aria-label="Recipient's username"
                  aria-describedby="button-addon2"
                  onChange={(e) => {
                    this.setState({ email: e.target.value });
                  }}
                />
                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  id="button-addon2"
                  onClick={() => {
                    axios
                      .post("/api/conversations", {
                        receiverEmail: this.state.email,
                        senderId: this.user.userId,
                      })
                      .then((res) => {
                        console.log(res.data);
                        let temp = this.state.conversations;
                        temp.push(res.data);
                        this.setState({
                          emailStatus: true,
                          conversations: temp,
                        });
                      })
                      .catch((error) => {
                        this.setState({ error: error.response.data.message });
                      });
                  }}
                >
                  Chat
                </button>
              </div>
              <div>{this.state.error}</div>
            </div>
          </div>
        ) : (
          <>
            <ul style={{ marginLeft: "250px" }} id="messages">
              {this.state.msgs.map((msg) => {
                return <li key={msg}>{msg}</li>;
              })}
            </ul>
            <div id="form" action="">
              <input
                id="input"
                autocomplete="off"
                onChange={(e) => {
                  this.setState({ msg: e.target.value });
                }}
                value={this.state.msg}
              />
              <button
                onClick={(e) => {
                  let message = this.state.msg;
                  axios.post("/api/messages", {
                    msg: message,
                    conversationId: this.state.currentConv._id,
                    sender: this.user.userId,
                  });
                  this.socket.emit("chat message", this.state.msg);
                  this.setState({ msg: "" });
                }}
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    );
  }
}
