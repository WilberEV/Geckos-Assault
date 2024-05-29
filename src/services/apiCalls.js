import axios from "axios";

const URL = " "

////////////////////USER RELATED FUNCTIONS////////////////////

//Login user
export const logInAccount = async (credentials) => {
  return await axios.post(`${URL}/user/login`, credentials);
};

//Create new user
export const userSignUp = async (credentials) => {
  return await axios.post(`${URL}/user/`, credentials);
};