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

  const [enemyHP, setEnemyHP] = useState({ 
    HP: 0,
  });
  const [playerHP, setPlayerHP] = useState({ 
    Max: 0,
    Current: 0
  });
  const [turn, setTurn] = useState(
    1
  );



  useEffect(() => {
    bringUserProfile(
      userRdxData.credentials.user.id,
      userRdxData.credentials.token
    )
      .then((results) => {
        setCharaDetails(results.data);
        setPlayerHP(results.data[0].stats.HP)
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
        setEnemyDetails(results.data);
        setEnemyHP(results.data.stats)
      })
      .catch((error) => console.log(error));
  });



//Handlers
useEffect(() => {
  if (!userRdxData.credentials.token) {
    navigate("/");
  }
}, []);
  
//Damage calculation
const attack = ()=>{

    let ATK = 0
    let DEF = 0

  if (turn == 1){

    console.log(playerHP, '22222')
    ATK = charaDetails[0].stats.Attack
    DEF = enemyDetails.stats.Defense

    let damage = atkDamage(ATK, DEF)
    let res = Math.round(enemyHP.HP-damage)
    let HP = {
      HP: res
    }
    setEnemyHP(HP)
    setTurn(2)
  } else {
    ATK = enemyDetails.stats.Attack
    DEF = charaDetails[0].stats.Defense

    let damage = atkDamage(ATK, DEF)
    console.log('//////', damage)
console.log('1111111111111111',playerHP)
    let res = Math.round(playerHP.Current-damage)
    console.log('------', res)

    let HP = {
      Max: 0,
      Current: res
    }
    setPlayerHP(HP)
    setTurn(1)
    console.log('||||||||', playerHP)

  }

}

const atkDamage = (ATK, DEF)=>{
  let damage = Math.abs(ATK - DEF)

  if(ATK > DEF){
    if (damage>=5){
      damage = (damage*1.3)
    } else if (damage>3 || damage>5){
      damage = (damage*1.2)
    } else if (damage <= 3)[
      damage = 3
    ]
  } else if(ATK < DEF){
    if (damage>=5){
      damage = (damage/3)
    } else if (damage>3 || damage>5){
      damage = (damage/2)
    } else if (damage <= 3)[
      damage = 3
    ]
  } else damage = 3

  return damage
}


  return (
    <div className="gameBody">
      <div className="gameUp">
        <div className="gameUpLeft">
          <div className="enemyStats">
            <div>{enemyDetails.name}</div>
            <div>{enemyDetails.stats.HP} / {enemyHP.HP}</div>
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
                      <div>{chara.stats.HP.Max} / {playerHP.Current}</div>
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
            <div className="terminalButton" onClick={() => attack()}>FIGHT</div>
            <div className="terminalButton" >ITEM</div>
            <div className="terminalButton">STATS</div>
            <div className="terminalButton">RIZZ</div>
          </div>
        </div>
      </div>
    </div>
  )
};