import { useEffect, useState } from "react";
import Block from "./Block";
import "./css/struct.css";

/**
 * Props for the `SensorStruct` component.
 * 
 * @property {string} rawSensor - The raw JSON string representing sensor data.
 * @property {boolean} leftBlock - Indicates whether this component represents the left block in the comparison.
 * @property {(value: string) => void} setText - Function to update the `rawSensor` state.
 * @property {string} [referenceText] - Optional reference JSON string used for comparison.
 * @property {(value: boolean) => void} [setComparaison] - Function to toggle comparison mode (only applicable for the left block).
 * @property {boolean} comparaisonEnable - Determines whether comparison mode is enabled.
 * @property {Object} [updateMap] - Functions to update highlight mappings.
 * @property {(value: Map<string, number>) => void} updateMap.setLeftHighlight - Function to update left-side highlight mapping.
 * @property {(value: Map<string, number>) => void} updateMap.setRightHighlight - Function to update right-side highlight mapping.
 * @property {Map<string, number>} highlight - Map storing highlighted differences for this component.
 */
interface Props {
    rawSensor: string;
    leftBlock: boolean;
    setText: (value: string) => void;
    referenceText?: string;
    setComparaison?: (value: boolean) => void;
    comparaisonEnable: boolean;

    updateMap: {
        setLeftHighlight: (value: Map<string, number>) => void;
        setRightHighlight: (value: Map<string, number>) => void;
    };
    highlight: Map<string, number>;
}

/**
 * `SensorStruct` component is responsible for displaying and handling JSON sensor data.
 * It allows input editing, comparison with a reference JSON, and highlights differences.
 */
const SensorStruct = ({
    rawSensor,
    leftBlock,
    setText,
    referenceText,
    setComparaison,
    comparaisonEnable,
    highlight,
    updateMap,
}: Props) => {
    // Stores the parsed JSON object from `rawSensor`
    const [sensor, setSensor] = useState({});

    // Stores error messages if JSON parsing fails
    const [error, setError] = useState("");

    // Controls the sticky click functionalit
    const [stickyEnable, setSticky] = useState(true);

    // Maps for highlighting differences
    const highlightStrLeft = new Map();
    const highlightStrRight = new Map();

    /**
     * Merges all objects within an array into a single object.
     * This helps in comparing array contents as a unified structure.
     * 
     * @param value - Array containing objects
     * @returns Merged object
     */
    const fusionObject = (value: any) => {
        const mergedSensor: any = {};

        value.forEach((item: any) => {
            if (typeof item === "object" && item !== null) {
                Object.keys(item).forEach((subKey) => {
                    mergedSensor[subKey] = item[subKey];
                });
            }
        });
        return mergedSensor;
    };

    /**
     * Recursively compares two JSON objects and highlights differences.
     * Differences are stored in `highlightStrLeft` and `highlightStrRight`.
     * 
     * It store in the map <key, number> (number = 1 | 2)
     * 1 = object doenst exist in both JSON
     * 2 = object doest exist in both JSON but value is different
     * 
     * @param sensor - JSON object to compare
     * @param comparSensor - Reference JSON object for comparison
     */
    const compareInput = (sensor: any, comparSensor: any) => {
        const sensorKey = Object.keys(sensor);
        const comparSensorKey = new Set(Object.keys(comparSensor));

        for (const key of sensorKey) {
            const value = sensor[key];
            const comparValue = comparSensor[key];

            // Key exists in `sensor` but not in `comparSensor`
            if (!(key in comparSensor)) {
                highlightStrRight.set(key, 1);
            }
            // Key exists but has a different type
            else if (typeof value !== typeof comparValue) {
                highlightStrRight.set(key, 2);
            }
            // value of left key isnt same as value in right key
            else if (typeof value !== "object") {
                if (value !== comparValue) {
                        highlightStrRight.set(key, 2);
                }
            }
            // Recursive comparison for nested objects or arrays
            else if (typeof value === "object" && typeof value !== null) {
                if (Array.isArray(value)) {
                    let mergedSensor = fusionObject(value);
                    let mergedComparSensor = fusionObject(comparValue);
                    compareInput(mergedSensor, mergedComparSensor);
                } else {
                    compareInput(value, comparValue);
                }
            }
            comparSensorKey.delete(key);
        }
        // Mark keys that exist in `comparSensor` but not in `sensor`
        for (const missingKey of comparSensorKey) {
            highlightStrLeft.set(missingKey, 1);
        }
    };

    /**
     * Handles user input changes and updates the state accordingly.
     */
    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    };

    /**
     * Effect that parse raw-sensor data && setSensor(JSON.parse(raw-sensor)) && triggers comparisons when necessary.
     * It also handles error handling for invalid JSON inputs.
     */ 
    useEffect(() => {
        if (rawSensor == "") {
            setError("");
            setSensor({});
            return;
        }
        if (rawSensor.startsWith('"')) {
            let tmp = rawSensor.slice(1, -1);
            tmp = tmp.split("\\").join("");
            setText(tmp);
        }
        try {
            let tmp = JSON.parse(rawSensor);
            setSensor(tmp);
            if (referenceText && comparaisonEnable) {
                let comparSensor = JSON.parse(referenceText);
                compareInput(tmp, comparSensor);
                if (updateMap) {
                    updateMap.setLeftHighlight(highlightStrLeft);
                    updateMap.setRightHighlight(highlightStrRight);
                }
            } else {
                if (updateMap) {
                    updateMap.setLeftHighlight(new Map());
                    updateMap.setRightHighlight(new Map());
                }
            }
            setError("");
        } catch (e: any) {
            setSensor({});
            setError(e.message);
        }
    }, [rawSensor, referenceText, comparaisonEnable]);

    const handleClickGlue = () => {
        setSticky(!stickyEnable);
    };

    const handleClickEqual = () => {
        if (setComparaison) {
            setComparaison(!comparaisonEnable);
        }
    };

    const imgStyle = (component: string) => {
        if (component == "glue") {
            return stickyEnable ? "imgEnable" : "imgDisable";
        }
        return comparaisonEnable ? "imgEnable" : "imgDisable";
    };

    const imgTitle = (component: string) => {
        if (component == "glue") {
            return stickyEnable ? "Disable sticky clik" : "Enable sticky click";
        }
        return comparaisonEnable ? "Disable leftBlock" : "Enable leftBlock";
    };

    return (
        <>
            <div className="struct">
                <div className="headerStruct">
                    <input
                        placeholder="sensor-data"
                        value={rawSensor}
                        onChange={handleInput}
                        className="inputStyle"
                    />
                    <img
                        src="colle.png"
                        alt="sticky"
                        title={imgTitle("glue")}
                        className={"imgStyle " + imgStyle("glue")}
                        onClick={handleClickGlue}
                    />
                    {leftBlock && (
                        <img
                            src="/public/equal.png"
                            alt="sticky"
                            title={imgTitle("equal")}
                            className={"imgStyle " + imgStyle("equal")}
                            onClick={handleClickEqual}
                        />
                    )}
                </div>
                {error !== "" ? (
                    <p>{error}</p>
                ) : Object.keys(sensor).length > 0 ? (
                    Object.entries(sensor).map(([key, value], index) => (
                        <Block
                            key={index}
                            id={key}
                            value={value}
                            level={0}
                            sticky={stickyEnable}
                            highlight={highlight}
                        ></Block>
                    ))
                ) : null}
            </div>
        </>
    );
};

export default SensorStruct;
