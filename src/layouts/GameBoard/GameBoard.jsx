import React, { useState, useEffect } from "react";
import "./GameBoard.css";
import { images } from "../../Components/Images/Images";

import { useSelector } from "react-redux";
import { userData } from "../userSlice";
import { useNavigate } from "react-router-dom";
import {
  bringUserProfile,
  updateUser,
  searchEnemy,
} from "../../services/apiCalls";
import { GameScreen } from "./GameScreen/GameScreen";
import { ItemScreen } from "./GameScreen/ItemScreen";
import { GameText } from "../../components/GameText/GameText";
import { StatsScreen } from "./GameScreen/StatsScreen";

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
    maxArea: 0,
    maxStratum: 1,
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
  const [statPoints, setStatPoints] = useState(0);

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

    if (charaDetails.stratum) {
      stratum = charaDetails.stratum;
    } else {
      stratum = charaDetails[0].stratum;
    }

    let area = 0;
    if (charaDetails.area == 0) {
      area = charaDetails.area;
    } else {
      area = charaDetails[0].area;
    }

    let type = "";
    if (area == 10) {
      type = "BOSS";
    } else type = "FOE";

    searchEnemy(ID, stratum, type)
      .then((results) => {
        setEnemyDetails(results.data);
        setEnemyHP(results.data.stats);
      })
      .catch((error) => console.log(error));
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
        MAX: playerHP.MAX,
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
  const checkHP = () => {
    if (turn == 4) {
      if (enemyHP.HP <= 0) {
        if (charaDetails[0].area == 10) {
          (charaDetails[0].area = 0),
            (charaDetails[0].stratum = charaDetails[0].stratum + 1);
        } else {
          charaDetails[0].area = charaDetails[0].area + 1;
        }

        charaDetails[0].stats.EXP =
          charaDetails[0].stats.EXP + enemyDetails.stats.EXP;

        if (
          charaDetails[0].stats.EXP >=
          (charaDetails[0].stats.expMulti.Min +
            charaDetails[0].stats.expMulti.Max) /
            2
        ) {
          charaDetails[0].stats.Level = charaDetails[0].stats.Level + 1;
          charaDetails[0].stats.expMulti.Min =
            charaDetails[0].stats.expMulti.Max;
          charaDetails[0].stats.expMulti.Max =
            charaDetails[0].stats.expMulti.Max * 2;
            setStatPoints(5)
            setTurn(9);
        } else {
          setTurn(7);
        }
      } else {
        setTurn(5);
      }
    } else {
      if (playerHP.Current <= 0) {
        setTurn(8);
      } else {
        setTurn(3);
      }
    }
  };

  //Use Item
  const useItem = (item, id) => {
    if (item == "Potion") {
      let res = Math.round(playerHP.Current + 20);

      if (res > playerHP.MAX) {
        res = playerHP.MAX;
      }

      let HP = {
        MAX: playerHP.MAX,
        Current: res,
      };

      setPlayerHP(HP);

      const updateItems = [...charaDetails];

      updateItems[0] = {
        ...updateItems[0],
        items: updateItems[0].items.filter((_, index) => index !== id),
      };
      setCharaDetails(updateItems);
    }
  };

  //Level Up chara
  const levelUp = (Stat) => {

  if (Stat === "HP") {

    let HP = {
      MAX: playerHP.MAX + 5,
      Current: playerHP.Current + 5,
    };
    setPlayerHP(HP);
  } else {
    charaDetails[0].stats[Stat] = charaDetails[0].stats[Stat] + 1;
  }
  console.log(statPoints)
  setStatPoints(statPoints-1)
  
  if (statPoints == 1) {
    setTurn(1)
  }
};

  //Update Character
  const updateChara = () => {
    let record = {
      maxArea: 0,
      maxStratum: 0,
    };

    if (charaDetails[0].stratum == charaDetails[0].maxStratum) {
      if (charaDetails[0].area > charaDetails[0].maxArea) {
        record.maxArea = charaDetails[0].area;
      } else record.maxArea = charaDetails[0].maxArea;
    } else if (charaDetails[0].stratum > charaDetails[0].maxStratum) {
      record.maxArea = charaDetails[0].area;
    }

    let charaData = {
      stats: {
        Attack: charaDetails[0].stats.Attack,
        Charisma: charaDetails[0].stats.Charisma,
        Defense: charaDetails[0].stats.Defense,
        EXP: charaDetails[0].stats.EXP,
        HP: {
          MAX: charaDetails[0].stats.HP.MAX,
          Current: playerHP.Current,
        },
        Level: charaDetails[0].stats.Level,
      },
      items: charaDetails[0].items,
      area: charaDetails[0].area,
      stratum: charaDetails[0].stratum,
      maxArea: record.maxArea,
      maxStratum: record.maxStratum,
    };

    updateUser(
      charaData,
      userRdxData.credentials.user.id,
      userRdxData.credentials.token
    );
    setTurn(1);
  };

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
            <div>
              <div className="enemyStats"> AREA: {charaDetails[0].area}</div>
              <div className="enemyStats">
                {" "}
                STRATUM: {charaDetails[0].stratum}
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
    {enemyDetails.name ? (
      itemMenu === 1 ? (
        <ItemScreen
          items={charaDetails[0].items}
          useItem={useItem}
          closeMenu={() => setItemMenu(0)}
        />
      ) : statsMenu === 1 ? (
        <StatsScreen
          stats={charaDetails[0].stats}
          maxArea={charaDetails[0].maxArea}
          maxStratum={charaDetails[0].maxStratum}
          closeMenu={() => setStatsMenu(0)}
        />
      ) : (
        <GameScreen
          {...{
            turn,
            setTurn,
            enemyDetails,
            charaDetails,
            enemyCount,
            setEnemyCount,
            GameText,
            checkHP,
            attack,
            updateChara,
            levelUp,
          }}
        />
      )
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
                      <div>
                        {chara.user} Level: {chara.stats.Level}
                      </div>
                      <div>
                        {playerHP.MAX} / {playerHP.Current}
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
