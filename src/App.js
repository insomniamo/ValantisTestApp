import React from "react";
import { hot } from "react-hot-loader/root";
import CardsList from "./components/CardsList/CardsList.js";
import "./styles/generic.css";

class App extends React.Component {
  render() {
    return (
      <>
        <CardsList />
        
      </>
    );
  }
}

export default hot(App);
