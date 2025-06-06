export const StatsScreen = ({ stats, maxArea, maxStratum, closeMenu }) => (
  <div>
    <div>
      <div>Attack: {stats.Attack}</div>
      <div>Defense: {stats.Defense}</div>
      <div>Charisma: {stats.Charisma}</div>
      <div>EXP: {stats.EXP}</div>
      <div>Max Area: {maxArea}</div>
      <div>Max Stratum: {maxStratum}</div>
      <div onClick={closeMenu}>Close</div>
    </div>
  </div>
);
