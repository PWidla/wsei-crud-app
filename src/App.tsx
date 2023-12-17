import { useState } from "react";
import "./App.css";
import Header from "./Layout components/Header";
import Posts from "./Crud components/Posts";
import Main from "./Layout components/Main";

function App() {
  return (
    <>
      <Header />
      <Main />
    </>
  );
}

export default App;
