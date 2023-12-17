import { useState } from "react";
import "./App.css";
import Header from "./Layout components/Header";
import Main from "./Layout components/Main";

function App() {
  let entities = ["Posts", "Comments"];

  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);

  const handleSelectEntity = (entity: string) => {
    setSelectedEntity(entity);
  };

  return (
    <>
      <Header entities={entities} onSelectEntity={handleSelectEntity} />
      <Main selectedEntity={selectedEntity} />
    </>
  );
}

export default App;
