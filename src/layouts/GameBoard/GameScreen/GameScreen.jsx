export const GameScreen = ({
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
}) => {
  const renderTurn = () => {
    switch (turn) {
      case 0:
        return <div onClick={() => setTurn(1)}>{GameText[0]}</div>;
      case 1:
        return (
          <div
            onClick={() => {
              setTurn(2);
              setEnemyCount(enemyCount + 1);
            }}
          >
            {GameText[1]}
          </div>
        );
      case 2:
        return (
          <div onClick={() => setTurn(3)}>
            {GameText[2]} {enemyDetails.name}
          </div>
        );
      case 3:
        return (
          <div>
            {GameText[3]} {charaDetails[0].user} {GameText[4]}
          </div>
        );
      case 4:
        return (
          <div onClick={checkHP}>
            {charaDetails[0].user} {GameText[5]} {enemyDetails.name}
          </div>
        );
      case 5:
        return (
          <div onClick={attack}>
            {GameText[3]} {enemyDetails.name} {GameText[4]}
          </div>
        );
      case 6:
        return (
          <div onClick={checkHP}>
            {enemyDetails.name} {GameText[5]} {charaDetails[0].user}
          </div>
        );
      case 7:
        return (
          <div onClick={updateChara}>
            {charaDetails[0].user} {GameText[6]} {enemyDetails.name}
          </div>
        );
      case 8:
        return (
          <div>
            {enemyDetails.name} {GameText[6]} {charaDetails[0].user}{" "}
            {GameText[7]}
          </div>
        );
      default:
        return <div>Loading</div>;
    }
  };

  return <div>{renderTurn()}</div>;
};
