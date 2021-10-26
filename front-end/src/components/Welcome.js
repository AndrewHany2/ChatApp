import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const verifyUser = (code) => {
  return axios
    .post("/api/confirm", { confirmationCode: code })
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.log(error));
};

const Welcome = (props) => {
  if (props.match.path === "/confirm/:confirmationCode") {
    verifyUser(props.match.params.confirmationCode);
  }

  return (
    <div className="container" style={{ marginTop: "10%" }}>
      <header className="jumbotron">
        <h3>
          <strong>Account confirmed!</strong>
        </h3>
      </header>
      <Link to={"/sign-in"}>Please Login</Link>
    </div>
  );
};

export default Welcome;
