export const ItemScreen = ({ items, useItem, closeMenu }) => (
  <div>
    <div>INVENTORY</div>
    <div>
      {items.map((item, index) => (
        <div key={index} className="itemContainer">
          <div className="charaSelectionContainer3">
            <div onClick={() => useItem(item, index)}>{item}</div>
          </div>
        </div>
      ))}
    </div>
    <div onClick={closeMenu}>Close</div>
  </div>
);
