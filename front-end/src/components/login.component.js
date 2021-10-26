import React, { Component } from "react";
import axios from "axios";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { email: "", password: "", error: "" };
  }
  componentDidMount() {
    this.googleSDK();
  }
  googleSDK() {
    window["googleSDKLoaded"] = () => {
      window["gapi"].load("auth2", () => {
        this.auth2 = window["gapi"].auth2.init({
          client_id:
            "401473858617-cpihslk4gt4q2c4s0jc43cj2kslictua.apps.googleusercontent.com",
          cookiepolicy: "single_host_origin",
          scope: "profile email",
        });
        this.prepareLoginButton();
      });
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "google-jssdk");
  }
  prepareLoginButton = () => {
    console.log(this.refs.googleLoginBtn);
    this.auth2.attachClickHandler(
      this.refs.googleLoginBtn,
      {},
      (googleUser) => {
        let profile = googleUser.getBasicProfile();
        console.log("Token || " + googleUser.getAuthResponse().id_token);
        console.log("ID: " + profile.getId());
        console.log("Name: " + profile.getName());
        console.log("Image URL: " + profile.getImageUrl());
        console.log("Email: " + profile.getEmail());
      },
      (error) => {
        alert(JSON.stringify(error, undefined, 2));
      }
    );
  };
  render() {
    return (
      <>
        <div className="auth-wrapper">
          <div className="auth-inner">
            <h3>Sign In</h3>

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

            <div className="form-group">
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="customCheck1"
                />
                <label className="custom-control-label" htmlFor="customCheck1">
                  Remember me
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              onClick={() => {
                axios
                  .post("/api/user/login", {
                    email: this.state.email,
                    password: this.state.password,
                  })
                  .then((res) => {
                    localStorage.setItem("userData", JSON.stringify(res.data));
                    this.props.history.push("/chat");
                  })
                  .catch((error) => {
                    this.setState({ error: error.response.data.message });
                  });
              }}
            >
              Login
            </button>
            <div class="mt-3">
              <button ref="googleLoginBtn">Login with google</button>
            </div>
            {this.state.error}
            <p className="forgot-password text-right">
              Forgot <a href="#">password?</a>
            </p>
          </div>
        </div>
      </>
    );
  }
}
