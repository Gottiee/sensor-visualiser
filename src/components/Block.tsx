import { useState } from "react";
import "./css/block.css"

interface Props {
    value: any;
    id?: string;
}

const Block = ({id, value}: Props) => {
    const [isOpen, setIsOpen] = useState(false)

    const handleClick = () => {
        setIsOpen(isOpen ? false : true)
    }

    const checkLengthStr = (str: string): string => {
        return str.length < 40 ? str : "[...]"
    }

    const valueToString = (value: any): string => {
        switch (typeof value) {
            case "string":
                return `"${value}"`
            case "number":
                return value.toString()
            case "boolean":
                return value ? "true" : "false"
            case "object":
                if (value === null)
                    return "null"
                if (Array.isArray(value))
                    return checkLengthStr("[" + value.map(item => valueToString(item)).join(", ") + "]");
                if (value instanceof Map)
                    return JSON.stringify(Object.fromEntries(value), null, 2)
                if (value instanceof Set)
                    return JSON.stringify(Array.from(value), null, 2)
                else
                    return JSON.stringify(value, null, 2)
            case "undefined":
                return "undefined"
            default:
                return `Type not known: ${typeof value} (see src/components/Block.tsx)`;
        }
    }

    const renderRecursif = (value:any) => {
        if (Array.isArray(value)){
            return (
                <>
                    {value.map((item, index) => (
                        <Block value={item} key={index}/>
                    ))}
                </>
            )
        }
        else if (typeof value === "object" && value !== null){
            return (
                <>
                    {Object.entries(value).map(([key, val], index) => (
                        <Block id={key} value={val} key={index}/>
                    ))}
                </>
            )
        }
        return null
    }

    return (
        <>
            <div onClick={handleClick} className="mainBlock">
                {id !== undefined && <p>"{id}" : </p>}
                <p>{valueToString(value)}</p>
            </div>
            {isOpen && (
                renderRecursif(value)
            )}
        </>
    )
}

export default Block