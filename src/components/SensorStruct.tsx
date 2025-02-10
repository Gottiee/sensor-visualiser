import { useEffect, useState } from "react"

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
            <input placeholder="sensor-data" value={rawSensor} onChange={handleInput}/>

            {error !== "" ? (
                <p>{error}</p>
            ) : Object.keys(sensor).length > 0 ? (
                <ul>
                    {Object.entries(sensor).map(([key, value], index) => (
                        <li key={index}>
                            <strong>{key}:</strong> {String(value)}
                        </li>
                    ))}
                </ul>
            ) : null}
        </>
    )
}

export default SensorStruct