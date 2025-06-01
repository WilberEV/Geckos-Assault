import React, { useState, useEffect } from "react";
import "./GameBoard.css";
import { images } from "../../Components/Images/Images";

import { useSelector } from "react-redux";
import { userData } from "../userSlice";
import { useNavigate } from "react-router-dom";
import { bringUserProfile, updateUser, searchEnemy } from "../../services/apiCalls";
import { GameScreen } from "../../components/GameScreen/GameScreen";

export const GameBoard = () => {
  const userRdxData = useSelector(userData);
  const navigate = useNavigate();

  //Hooks
  const [charaDetails, setCharaDetails] = useState({
    user: "",
    stats: {},
    items: [],
    area: 0,
    stratum: 1,
  });

  const [enemyDetails, setEnemyDetails] = useState({
    name: "",
    stats: {
      HP: 0,
      Attack: 0,
      Defense: 0,
      EXP: 0,
    },
    IMG: "",
  });

  const [enemyHP, setEnemyHP] = useState({
    HP: 0,
  });
  const [playerHP, setPlayerHP] = useState({
    MAX: 0,
    Current: 0,
  });

  const [turn, setTurn] = useState(0);
  const [statsMenu, setStatsMenu] = useState(0);
  const [itemMenu, setItemMenu] = useState(0);
  const [enemyCount, setEnemyCount] = useState(0);

  useEffect(() => {
    bringUserProfile(
      userRdxData.credentials.user.id,
      userRdxData.credentials.token
    )
      .then((results) => {
        setCharaDetails(results.data);
        setPlayerHP(results.data[0].stats.HP);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    let ID = Math.round((Math.random() * 10) / 2);

    if (ID == 0) {
      ID = ID + 1;
    }
    let stratum = 0;

    if (charaDetails.stratum){
      stratum = charaDetails.stratum
    } else {
      stratum = charaDetails[0].stratum
    }

    let area = 0
    if (charaDetails.area == 0){
      area = charaDetails.area
    } else {
      area = charaDetails[0].area
    }

    let type = "";
    if (area == 10){
      type = "BOSS"
    } else type = "FOE"

    searchEnemy(ID, stratum, type)
      .then((results) => {
        setEnemyDetails(results.data);
        setEnemyHP(results.data.stats);
      })
      .catch((error) => console.log(error)
    );
  }, [enemyCount]);

  //Handlers
  useEffect(() => {
    if (!userRdxData.credentials.token) {
      navigate("/");
    }
  }, []);

  //Damage calculation
  const attack = () => {
    let ATK = 0;
    let DEF = 0;

    if (turn == 3) {
      ATK = charaDetails[0].stats.Attack;
      DEF = enemyDetails.stats.Defense;

      let damage = atkDamage(ATK, DEF);
      let res = Math.round(enemyHP.HP - damage);
      let HP = {
        HP: res,
      };

      setEnemyHP(HP);
      setTurn(4);
    } else if (turn == 5) {
      ATK = enemyDetails.stats.Attack;
      DEF = charaDetails[0].stats.Defense;

      let damage = atkDamage(ATK, DEF);
      let res = Math.round(playerHP.Current - damage);

      let HP = {
        MAX: 0,
        Current: res,
      };

      setPlayerHP(HP);
      setTurn(6);
    }
    
  };

  const atkDamage = (ATK, DEF) => {
    let damage = Math.abs(ATK - DEF);

    if (ATK > DEF) {
      if (damage >= 5) {
        damage = damage * 1.3;
      } else if (damage > 3 || damage < 5) {
        damage = damage * 1.2;
      } else if (damage <= 3) [(damage = 3)];
    } else if (ATK < DEF) {
      if (damage >= 5) {
        damage = damage / 3;
      } else if (damage > 3 || damage < 5) {
        damage = damage / 2;
      } else if (damage <= 3) [(damage = 3)];
    } else damage = 3;

    return damage;
  };

  //Check if Player's or Enemy's HP is below 0
  const checkHP = ()=>{
    if (turn == 4) {
      if (enemyHP.HP <= 0){
        setTurn(7)
        charaDetails[0].area = charaDetails[0].area +1
      } else {
        setTurn(5)
      }
    } else {
      if (playerHP.Current <= 0){
        setTurn(8)
      } else {
        setTurn(3)
      }
    }

  }

  //Update Character
  const updateChara = ()=>{
    let charaData = {
      stats: {
        Attack: charaDetails[0].stats.Attack,
        Charisma: charaDetails[0].stats.Charisma,
        Defense: charaDetails[0].stats.Defense,
        EXP: charaDetails[0].stats.EXP,
        HP: {
          MAX: charaDetails[0].stats.HP.MAX,
          Current: playerHP.Current
        },
        Level: charaDetails[0].stats.Level
      },
      items: charaDetails[0].items,
      area: charaDetails[0].area,
      stratum: charaDetails[0].stratum
    }

    updateUser(
      charaData,
      userRdxData.credentials.user.id,
      userRdxData.credentials.token
    )
    setTurn(1)
  }

  return (
    <div className="gameBody">
      <div>
        {enemyCount > 0 ? (
          <div className="gameUp">
            <div className="gameUpLeft">
              <div className="enemyStats">
                <div>{enemyDetails.name}</div>
                <div>
                  {enemyDetails.stats.HP} / {enemyHP.HP}
                </div>
              </div>
            </div>

            <div className="gameUpRight">
              <div className="enemySprite">
                {enemyDetails.IMG !== "" ? (
                  <img src={enemyDetails.IMG} />
                ) : (
                  <div>Loading</div>
                )}
              </div>
              <div className="enemyStage"></div>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>

      <div className="gameMid">
        <div className="gameScreen">
          {enemyDetails.name !== "" ? (
            <div>
              {itemMenu == 1 ? (
                <div onClick={() => setItemMenu(0)}>INVENTORY</div>
              ) : (
                <div>
                  {statsMenu == 1 ? (
                    <div onClick={() => setStatsMenu(0)}>
                      <div>Attack: {charaDetails[0].stats.Attack}</div>
                      <div>Defense: {charaDetails[0].stats.Defense}</div>
                      <div>Charisma: {charaDetails[0].stats.Charisma}</div>
                      <div>EXP: {charaDetails[0].stats.EXP}</div>
                    </div>
                  ) : (
                    <div>
                      {turn == 0 ? (
                        <div onClick={() => setTurn(1)}>{GameScreen[0]}</div>
                      ) : (
                        <div>
                          {turn == 1 ? (
                            <div
                              onClick={() => {
                                setTurn(2);
                                setEnemyCount(enemyCount + 1);
                              }}
                            >
                              {GameScreen[1]}
                            </div>
                          ) : (
                            <div>
                              {turn == 2 ? (
                                <div onClick={() => setTurn(3)}>
                                  {GameScreen[2]}
                                  {enemyDetails.name}
                                </div>
                              ) : (
                                <div>
                                  {turn == 3 ? (
                                    <div>
                                      {GameScreen[3]}
                                      {charaDetails[0].user}
                                      {GameScreen[4]}
                                    </div>
                                  ) : (
                                    <div>
                                      {turn == 4 ? (
                                        <div onClick={() => checkHP()}>
                                          {charaDetails[0].user}
                                          {GameScreen[5]}
                                          {enemyDetails.name}
                                        </div>
                                      ) : (
                                        <div>
                                          {turn == 5 ? (
                                            <div onClick={() => attack()}>
                                              {GameScreen[3]}
                                              {enemyDetails.name}
                                              {GameScreen[4]}
                                            </div>
                                          ) : (
                                            <div>
                                              {turn == 6 ? (
                                                <div onClick={() => checkHP()}>
                                                  {enemyDetails.name}
                                                  {GameScreen[5]}
                                                  {charaDetails[0].user}
                                                </div>
                                          ) : (
                                            <div>
                                            {turn == 7 ? (
                                              <div onClick={() => updateChara()}>
                                                {charaDetails[0].user}
                                                {GameScreen[6]}
                                                {enemyDetails.name}
                                              </div>
                                              ) : (
                                                <div>
                                                {turn == 8 ? (
                                                  <div>
                                                    {enemyDetails.name}
                                                    {GameScreen[6]}
                                                    {charaDetails[0].user}
                                                    {GameScreen[7]}
                                                  </div>
                                                  ) : (
                                                    <div>Loading</div>
                                                  )}
                                                    </div>
                                              )}
                                                </div>
                                          )}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div>Loading</div>
          )}
        </div>
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
                      <div>
                        {chara.stats.HP.MAX} / {playerHP.Current}
                      </div>
                    </div>
                    <div className="playerContainer">
                      <div className="playerSprite">
                        <img src={images.PSprite} />
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
            <div
              className="terminalButton"
              onClick={() => {
                setStatsMenu(0);
                setItemMenu(0);
                attack();
              }}
            >
              FIGHT
            </div>
            <div
              className="terminalButton"
              onClick={() => {
                setItemMenu(1);
                setStatsMenu(0);
              }}
            >
              ITEM
            </div>
            <div
              className="terminalButton"
              onClick={() => {
                setStatsMenu(1);
                setItemMenu(0);
              }}
            >
              STATS
            </div>
            <div className="terminalButton">RIZZ</div>
          </div>
        </div>
      </div>
    </div>
  );
};
