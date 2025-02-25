import { useState } from "react";
import SensorStruct from "./components/SensorStruct";

/**
 * Main application component that manages the state and renders two `SensorStruct` components.
 * It handles text inputs, comparison mode, and highlights differences between the two JSON structures.
 */
function App() {
    //store texte input
    const [leftText, setLeftText] = useState("");
    const [rightText, setRightText] = useState("");

    // State to enable or disable the comparison mode
    const [compare, setCompare] = useState(true);

    // Maps to store highlighted differences for the left and right JSON structures
    const [leftHighlight, setLeftHighlight] = useState(new Map());
    const [rightHighlight, setRightHighlight] = useState(new Map());

    return (
        <>
            <div className="fullStruct">
                <SensorStruct
                    leftBlock={true}
                    setText={setLeftText}
                    rawSensor={leftText}
                    setComparaison={setCompare}
                    comparaisonEnable={compare}
                    highlight={leftHighlight}
                />
                <SensorStruct
                    leftBlock={false}
                    setText={setRightText}
                    rawSensor={rightText}
                    comparaisonEnable={compare}
                    referenceText={leftText}
                    highlight={rightHighlight}
                    updateMap={{ setLeftHighlight, setRightHighlight }}
                />
            </div>
        </>
    );
}

export default App;
