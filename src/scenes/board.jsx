const board = (file) => {
  return (
    <div id="leaderboard" className="board">
      {file.map((idx, name, score) => {
        return (
          <div id={idx} className="line">
            <div>{idx}</div>
            <div>{name}</div>
            <div>{score}</div>
          </div>
        );
      })}
    </div>
  );
};

export default board;
