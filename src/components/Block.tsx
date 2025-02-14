import { useEffect, useState } from "react";
import "./css/block.css"

interface Props {
    value: any;
    id?: string;
    level: number;
    sticky: boolean;
}

const Block = ({id, value, level, sticky}: Props) => {
    const [isOpen, setIsOpen] = useState(false)
    const [displayArrow, setDisplayArrow] = useState(false)

    useEffect(() => {
        if (typeof value === "object" && value !== null) {
            setDisplayArrow(true);
        } else {
            setDisplayArrow(false);
        }
    }, [value]);

    const handleClick = () => {
        setIsOpen(!isOpen)
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
                    {value.map((item, _) => (
                        typeof item === "object" 
                        && item !== null 
                        && Object.entries(item).map(([key, val], index) => (
                            <Block id={key} value={val} key={index} level={level+1} sticky={sticky}/>
                    ))))}
                </>
            )
        }
        else if (typeof value === "object" && value !== null){
            return (
                <>
                    {Object.entries(value).map(([key, val], index) => (
                        <Block id={key} value={val} key={index} level={level+1} sticky={sticky}/>
                    ))}
                </>
            )
        }
        return null
    }

    const getColorClass = (status: number) => {
        switch (status % 4) {
            case 0:
                return "level1";
            case 1:
                return "level2";
            case 2:
                return "level3";
            case 3:
                return "level4";
        }
    };

    const isSticky = () => {
        if (isOpen && sticky)
            return "sticky"
        return 
    }

    return (
        <>
            <div onClick={handleClick} className={"mainBlock " + getColorClass(level) + " " + isSticky()}>
                <div className="textBlock">
                    {id !== undefined &&
                    <>
                        <p className="pBlock">"{id}"</p>
                        <p className="pBlock pDot"> : </p>
                    </>
                    }
                    <p className="pBlock">{valueToString(value)}</p>
                </div>
                {displayArrow && <div className="toOpenBlock"><p className="pBlock">{isOpen ? "▶" : "▼"}</p></div>}
            </div>
            {isOpen && (
                renderRecursif(value)
            )}
        </>
    )
}

export default Block