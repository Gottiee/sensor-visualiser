import { useEffect, useState } from "react"
import Block from "./Block"
import "./css/struct.css"

interface Props {
    comparaison: boolean;
}


const SensorStruct = ({comparaison}: Props) => {
    const [rawSensor, setRawSensor] = useState("")
    const [sensor, setSensor] = useState({})
    const [error, setError] = useState("")
    const [stickyEnable, setSticky] = useState(true)
    const [comparaisonEnable, setComparaison] = useState(true)

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRawSensor(event.target.value)
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
            setRawSensor(tmp)
        }
        try{
            setSensor(JSON.parse(rawSensor))
            setError("")
        }
        catch (e: any) {
            setSensor({})
            setError(e.message)
        }

    }, [rawSensor])

    const handleClickGlue = () => {
        setSticky(!stickyEnable)
    }
    const handleClickEqual = () => {
        setComparaison(!comparaisonEnable)
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
                        <Block key={index} id={key} value={value} level={0} sticky={stickyEnable}></Block>
                    ))
                ) : null}
            </div>
        </>
    )
}

export default SensorStruct