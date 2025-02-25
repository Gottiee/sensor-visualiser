import { useState } from "react";
import SensorStruct from "./components/SensorStruct";

function App() {
  const [leftText, setLeftText] = useState("")
  const [rightText, setRightText] = useState("")
  const [compare, setCompare] = useState(true)
  const [leftHighlight, setLeftHighlight] = useState(new Map())
  const [rightHighlight, setRightHighlight] = useState(new Map())

  return (
    <>
      <div className="fullStruct">
        <SensorStruct comparaison={true} setText={setLeftText} rawSensor={leftText} setComparaison={setCompare} comparaisonEnable={compare} highlight={leftHighlight}/>
        <SensorStruct comparaison={false} setText={setRightText} rawSensor={rightText} comparaisonEnable={compare} referenceText={leftText} highlight={rightHighlight} updateMap={{setLeftHighlight, setRightHighlight}}/>
      </div>
    </>
  );
}

export default App;
