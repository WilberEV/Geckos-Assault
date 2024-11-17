import axios from "axios";

const URL = "http://localhost:3000"

////////////////////USER RELATED FUNCTIONS////////////////////

//Login user
export const logInAccount = async (credentials) => {
  return await axios.post(`${URL}/user/login`, credentials);
};

//Create new user
export const userSignUp = async (credentials) => {
  return await axios.post(`${URL}/user/`, credentials);
};

//Find user
export const bringUserProfile = async (id, token) => {
  let config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  return await axios.get(`${URL}/user/${id}`, config);
};


////////////////////ENEMY RELATED FUNCTIONS////////////////////

//Find enemy
export const searchEnemy = async (ID, stratum, type) => {

  if (type == 'BOSS'){
    ID = 6
  }

  return await axios.get(`${URL}/enemies?ID=${ID}&stratum=${stratum}&type=${type}`);
};

