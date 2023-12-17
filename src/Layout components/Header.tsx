import "./Header.css";
import { useState } from "react";

interface Props {
  entities: string[];
  onSelectEntity: (entity: string) => void;
}

function Header({ entities, onSelectEntity }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  return (
    <div id="header">
      <h1>crud knut</h1>
      {entities.length === 0 ? <p>No entity found</p> : null}
      {entities.length === 0 && <p>No entity found</p>}
      <ul>
        {entities.map((entity, index) => (
          <li
            className={
              selectedIndex === index ? "active-entity" : "inactive-entity"
            }
            key={entity}
            onClick={() => {
              setSelectedIndex(index);
              onSelectEntity(entity);
            }}
          >
            {entity}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Header;
