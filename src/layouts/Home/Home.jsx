import React, { useState, useEffect } from "react";
import "./Home.css";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logInAccount } from "../../services/apiCalls";
import jwt_decode from "jwt-decode";
import { InputText } from "../../components/InputText/InputText";
import { login, userData } from "../userSlice";

export const Home = () => {
  const dispatch = useDispatch();
  const userRdxData = useSelector(userData);
  const navigate = useNavigate();

  //Hooks
  const [credentials, setCredentials] = useState({
    user: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  //Handler
  const inputHandler = (e) => {
    setCredentials((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const logMeIn = () => {
    logInAccount(credentials)
      .then((result) => {
        const decoded = jwt_decode(result.data.token);
        const datos = {
          token: result.data.token,
          user: decoded,
        };
        dispatch(login({ credentials: datos }));

        setMessage("May your path be lighted.");

        setTimeout(() => {
          navigate("/gameboard");
        }, 2750);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (userRdxData.credentials.token) {
      navigate("/");
    }
  }, []);

  return (
    <div className="homeBody">

      {message != "" ? (
        <div className="welcomeText">{message}</div>
      ) : (
        <div className="homeContainer">
          <div className="homeContainer2">
            <div>User:</div>
            <InputText
              type={"user"}
              className={"basicInput"}
              placeholder={""}
              name={"user"}
              handler={inputHandler}
            />
            <div>Password:</div>
            <InputText
              type={"password"}
              className={"basicInput"}
              placeholder={""}
              name={"password"}
              handler={inputHandler}
            />
          </div>
          <div className="homeContainer3">
            <div className="homeButton" onClick={() => logMeIn()}>
              Login
            </div>
          </div>
        </div>
      )}
    </div>
  );
};