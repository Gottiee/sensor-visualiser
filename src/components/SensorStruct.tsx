import { useEffect, useState } from "react"
import Block from "./Block"
import "./css/struct.css"

interface Props {
    rawSensor: string;
    comparaison: boolean;
    setText: (value:string) => void;
    referenceText?:string;
    setComparaison?: (value:boolean)=> void;
    comparaisonEnable: boolean;

    updateMap?: { 
        setLeftHighlight: (value: Map<string, number>) => void; 
        setRightHighlight: (value: Map<string, number>) => void;
    };
    highlight: Map<string, number>
}

const SensorStruct = ({rawSensor, comparaison, setText, referenceText, setComparaison, comparaisonEnable, highlight, updateMap}: Props) => {
    const [sensor, setSensor] = useState({})
    const [error, setError] = useState("")
    const [stickyEnable, setSticky] = useState(true)

    const highlightStrLeft = new Map()
    const highlightStrRight = new Map()
    
    const fusionObject = (value:any) => {
        const mergedSensor:any = {}

        value.forEach((item:any) => {
            if (typeof item === "object" && item !== null) {
                Object.keys(item).forEach((subKey) => {
                    mergedSensor[subKey] = item[subKey];
                });
            }
        });
        return mergedSensor
    }

    const compareInput = (sensor:any, comparSensor:any, ) => {
        const sensorKey = Object.keys(sensor)
        const comparSensorKey = new Set(Object.keys(comparSensor))

        for (const key of sensorKey){
            const value = sensor[key]
            const comparValue = comparSensor[key]
            
            // right key is not in the left key
            if (!(key in comparSensor)){
                highlightStrRight.set(key, 1)
            }
            else if (typeof value !== typeof comparValue){
                highlightStrRight.set(key, 2)
            }
            // value of left key isnt same as value in right key
            else if (typeof value !== "object"){
                if (value !== comparValue){{
                    highlightStrRight.set(key, 2)
                }}
            }
            // recursif if value is an object
            else if (typeof value === "object" && typeof value !== null) {
                if (Array.isArray(value)){
                    let mergedSensor = fusionObject(value)
                    let mergedComparSensor = fusionObject(comparValue)
                    compareInput(mergedSensor, mergedComparSensor)
                }
                else{
                    compareInput(value, comparValue)
                }
            }
            comparSensorKey.delete(key)
        }
        for (const missingKey of comparSensorKey){
            highlightStrLeft.set(missingKey, 1)
        }
    }

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value)
    }

    useEffect(() => {
        if (rawSensor == ""){
            setError("")
            setSensor({})
            return 
        }
        if (rawSensor.startsWith('"')){
            let tmp = rawSensor.slice(1, -1)
            tmp = tmp.split("\\").join("")
            setText(tmp)
        }
        try{
            let tmp = JSON.parse(rawSensor)
            setSensor(tmp)
            if (referenceText && comparaisonEnable){
                let comparSensor = JSON.parse(referenceText)
                compareInput(tmp, comparSensor)
                if (updateMap) {
                    updateMap.setLeftHighlight(highlightStrLeft)
                    updateMap.setRightHighlight(highlightStrRight)
                }
            }
            else {
                if (updateMap){
                    updateMap.setLeftHighlight(new Map());
                    updateMap.setRightHighlight(new Map());
                }
            }
            setError("")
        }
        catch (e: any) {
            setSensor({})
            setError(e.message)
        }

    }, [rawSensor, referenceText, comparaisonEnable])

    const handleClickGlue = () => {
        setSticky(!stickyEnable)
    }

    const handleClickEqual = () => {
        if (setComparaison) {
            setComparaison(!comparaisonEnable)
        }
    }

    const imgStyle = (component: string) => {
        if (component == "glue") {
            return stickyEnable ? "imgEnable" : "imgDisable"
        }
        return comparaisonEnable ? "imgEnable" : "imgDisable"
    }

    const imgTitle = (component: string) => {
        if (component == "glue") {
            return stickyEnable ? "Disable sticky clik" : "Enable sticky click"
        }
        return comparaisonEnable ? "Disable comparaison" : "Enable comparaison"

    }

    return (
        <>
            <div className="struct">
                <div className="headerStruct">
                    <input placeholder="sensor-data" value={rawSensor} onChange={handleInput} className="inputStyle"/>
                    <img src="/public/colle.png" alt="sticky" title={imgTitle("glue")} className={"imgStyle " + imgStyle("glue")} onClick={handleClickGlue}/>
                    { comparaison && <img src="/public/equal.png" alt="sticky" title={imgTitle("equal")} className={"imgStyle " + imgStyle("equal")} onClick={handleClickEqual}/>}
                </div>
                {error !== "" ? (
                    <p>{error}</p>
                ) : Object.keys(sensor).length > 0 ? (
                    Object.entries(sensor).map(([key, value], index) => (
                        <Block key={index} id={key} value={value} level={0} sticky={stickyEnable} highlight={highlight}></Block>
                    ))
                ) : null}
            </div>
        </>
    )
}

export default SensorStruct