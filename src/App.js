import "./App.css"
import ParentView from './view/ParentView';
import { initLanguages } from "./config/Localization";
import { useState } from "react";

import api from "./api";

function App() {

  const [langIsLoaded, setLangIsLoaded] = useState(false)

  initLanguages().then(() => {
    setLangIsLoaded(true);
  });

  return (
    <ParentView/>
  );
}

export default App;