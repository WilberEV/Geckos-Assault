import React, { useState, useEffect } from "react";
import "./GameBoard.css";
import { images } from "../../Components/Images/Images";

import { useSelector } from "react-redux";
import { userData } from "../userSlice";
import { useNavigate } from "react-router-dom";
import { bringUserProfile } from "../../services/apiCalls";
import { searchEnemy } from "../../services/apiCalls";



export const GameBoard = () => {

  const userRdxData = useSelector(userData);
  const navigate = useNavigate();

  //Hooks
  const [charaDetails, setCharaDetails] = useState({
    user: "",
    stats: {},
    items: [],
    area: 0,
    stratum: 1
  });

  const [enemyDetails, setEnemyDetails] = useState({
    name: "",
    stats: {
      "HP": 0,
      "Attack": 0,
      "Defense": 0,
      "EXP": 0
    },
    IMG: ""
  });



  useEffect(() => {
    bringUserProfile(
      userRdxData.credentials.user.id,
      userRdxData.credentials.token
    )
      .then((results) => {
        setCharaDetails(results.data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    let ID = Math.round((Math.random() * 10)/2)
    if (ID == 0){
     ID = ID+1
   } 
    let stratum = charaDetails.stratum
    let type = ""
    if (charaDetails.area == 10){
      type = "BOSS"
    } else type = "FOE"

    searchEnemy(
      ID,
      stratum,
      type
    )
      .then((results) => {
        
        setEnemyDetails(results.data[0]);
        setEnemyPicture(results.data[0].IMG)
      })
      .catch((error) => console.log(error));
  });



//Handlers
useEffect(() => {
  if (!userRdxData.credentials.token) {
    navigate("/");
  }
}, []);
  

  return (
    <div className="gameBody">
      <div className="gameUp">
        <div className="gameUpLeft">
          <div className="enemyStats">
          <div>{enemyDetails.name}</div>
          <div>{enemyDetails.stats.HP} / {enemyDetails.stats.HP}</div>
          </div>
        </div>

        <div className="gameUpRight">
        <div className="enemySprite">
            {enemyDetails.IMG !== "" ? (
              <img src= {enemyDetails.IMG}/>
            ) : (<div>Loading</div>)}
          </div>
          <div className="enemyStage"></div>
        </div>
      </div>


      <div className="gameMid">
        <div className="gameScreen"></div>
      </div>


      <div className="gameDown">
        <div>

          {charaDetails.user !== "" ? (
            <div>
              {charaDetails.map((chara) => {
                return (
                  <div key={chara._id} className="gameDownLeft">
                    <div className="playerInfo">
                      <div>{chara.user}</div>
                      <div>{chara.stats.HP.Max} / {chara.stats.HP.Current}</div>
                    </div>
                    <div className="playerContainer">
                      <div className="playerSprite">
                        <img src={images.PSprite}/>
                      </div>
                      <div className="playerStage"></div>
                    </div>          
                </div>
                  
                );
              })}
            </div>
          ) : (
            <div>Loading</div>
          )}

        </div>
        
        <div className="gameDownRight">
          <div className="terminal">
            <div className="terminalButton">FIGHT</div>
            <div className="terminalButton">ITEM</div>
            <div className="terminalButton">STATS</div>
            <div className="terminalButton">RIZZ</div>
          </div>
        </div>
      </div>
    </div>
  )
};