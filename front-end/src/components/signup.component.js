import React, { Component } from "react";
import axios from "axios";

export default class SignUp extends Component {
  async register() {
    try {
      const res = await axios.post("/api/user/register", {
        email: this.state.email,
        username: this.state.username,
        password: this.state.password,
        error: "",
      });
      if (res) {
        console.log(res);
        this.props.history.push("/sign-in");
      }
    } catch (error) {
      this.setState({ error: error.response.data.message });
    }
  }
  constructor(props) {
    super(props);
    this.state = { username: "", email: "", password: "", response: "" };
  }
  render() {
    return (
      <>
        <div className="auth-wrapper">
          <div className="auth-inner">
            <h3>Sign Up</h3>

            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="Last name"
                onChange={(e) => {
                  this.setState({ username: e.target.value });
                }}
              />
            </div>

            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                onChange={(e) => {
                  this.setState({ email: e.target.value });
                }}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                onChange={(e) => {
                  this.setState({ password: e.target.value });
                }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              onClick={() => {
                this.register();
              }}
            >
              Sign Up
            </button>
            <p className="forgot-password text-right">
              Already registered <a href="/sign-in">sign in?</a>
            </p>
            {this.state.error}
            {this.state.response}
          </div>
        </div>
      </>
    );
  }
}
