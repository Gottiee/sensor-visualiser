import { useEffect, useState } from "react"
import Block from "./Block"
import "./css/struct.css"

function SensorStruct() {
    const [rawSensor, setRawSensor] = useState("")
    const [sensor, setSensor] = useState({})
    const [error, setError] = useState("")

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRawSensor(event.target.value)
    }

    useEffect(() => {
        if (rawSensor == ""){
            setError("")
            setSensor({})
            return 
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

    return (
        <>
            <div className="fullStruct">
                <div className="struct">
                    <input placeholder="sensor-data" value={rawSensor} onChange={handleInput} className="inputStyle"/>
                    {error !== "" ? (
                        <p>{error}</p>
                    ) : Object.keys(sensor).length > 0 ? (
                        Object.entries(sensor).map(([key, value], index) => (
                            <Block key={index} id={key} value={value}></Block>
                        ))
                    ) : null}
                </div>
                <div className="struct">
                    <input placeholder="sensor-data" value={rawSensor} onChange={handleInput} className="inputStyle"/>
                    {error !== "" ? (
                        <p>{error}</p>
                    ) : Object.keys(sensor).length > 0 ? (
                        Object.entries(sensor).map(([key, value], index) => (
                            <Block key={index} id={key} value={value}></Block>
                        ))
                    ) : null}
                </div>
            </div>
        </>
    )
}

export default SensorStruct