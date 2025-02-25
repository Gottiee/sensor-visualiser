import { useEffect, useState } from "react";
import "./css/block.css";

/**
 * Props for the `Block` component.
 *
 * @property {any} value - The value to be displayed (can be of any type).
 * @property {string} [id] - Optional identifier key for this block.
 * @property {number} level - The depth level in the JSON structure (used for styling).
 * @property {boolean} sticky - Determines if clicking on a block keeps it open persistently.
 * @property {Map<string, number>} highlight - Map storing highlight information for differences.
 */
interface Props {
    value: any;
    id?: string;
    level: number;
    sticky: boolean;
    highlight: Map<string, number>;
}

/**
 * `Block` component is responsible for rendering a hierarchical JSON structure.
 * 
 * Features:
 * - Supports expandable/collapsible JSON objects and arrays.
 * - Provides syntax highlighting based on depth level.
 * - Highlights differences when a comparison is enabled.
 * - Handles various data types (string, number, boolean, arrays, objects, maps, sets).
 */
const Block = ({ id, value, level, sticky, highlight }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [displayArrow, setDisplayArrow] = useState(false);

    /**
     * Determines whether an arrow should be displayed for expandable objects/arrays.
     */
    useEffect(() => {
        if (typeof value === "object" && value !== null) {
            setDisplayArrow(true);
        } else {
            setDisplayArrow(false);
        }
    }, [value]);

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    /**
     * Limits the string representation of arrays/objects to 40 characters.
     */
    const checkLengthStr = (str: string): string => {
        return str.length < 40 ? str : "[...]";
    };

    /**
     * Converts various data types into a string representation.
     * Ensures proper JSON-like formatting.
     */
    const valueToString = (value: any): string => {
        switch (typeof value) {
            case "string":
                return `"${value}"`;
            case "number":
                return value.toString();
            case "boolean":
                return value ? "true" : "false";
            case "object":
                if (value === null) return "null";
                if (Array.isArray(value))
                    return checkLengthStr(
                        "[" +
                            value
                                .map((item) => valueToString(item))
                                .join(", ") +
                            "]"
                    );
                if (value instanceof Map)
                    return JSON.stringify(Object.fromEntries(value), null, 2);
                if (value instanceof Set)
                    return JSON.stringify(Array.from(value), null, 2);
                else return JSON.stringify(value, null, 2);
            case "undefined":
                return "undefined";
            default:
                return `Type not known: ${typeof value} (see src/components/Block.tsx)`;
        }
    };

    /**
     * Recursively renders nested objects and arrays.
     */
    const renderRecursif = (value: any) => {
        if (Array.isArray(value)) {
            return (
                <>
                    {value.map(
                        (item, _) =>
                            typeof item === "object" &&
                            item !== null &&
                            Object.entries(item).map(([key, val], index) => (
                                <Block
                                    id={key}
                                    value={val}
                                    key={index}
                                    level={level + 1}
                                    sticky={sticky}
                                    highlight={highlight}
                                />
                            ))
                    )}
                </>
            );
        } else if (typeof value === "object" && value !== null) {
            return (
                <>
                    {Object.entries(value).map(([key, val], index) => (
                        <Block
                            id={key}
                            value={val}
                            key={index}
                            level={level + 1}
                            sticky={sticky}
                            highlight={highlight}
                        />
                    ))}
                </>
            );
        }
        return null;
    };

    /**
     * Determines the CSS class for depth-based color and highlighting.
     */
    const getColorClass = (status: number) => {
        let color = getIdHighlight();
        if (color != "") {
            return color;
        }
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
        if (isOpen && sticky) return "sticky";
        return;
    };

    /**
     * Retrieves highlight class for the block ID.
     */
    const getIdHighlight = () => {
        let tmp;
        if (id) {
            if ((tmp = highlight.get(id))) {
                if (tmp == 1) return "highlight";
            }
        }
        return "";
    };

    /**
     * Retrieves highlight class for the value.
     */
    const getValueHighlight = () => {
        let tmp;
        if (id) {
            if ((tmp = highlight.get(id))) {
                if (tmp == 2) {
                    return "highlight";
                }
            }
        }
        return "";
    };

    return (
        <>
            <div
                onClick={handleClick}
                className={
                    "mainBlock " + getColorClass(level) + " " + isSticky()
                }
            >
                <div className="textBlock">
                    {id !== undefined && (
                        <>
                            <p className="pBlock">"{id}"</p>
                            <p className="pBlock pDot"> : </p>
                        </>
                    )}
                    <p className={"pBlock " + getValueHighlight()}>
                        {valueToString(value)}
                    </p>
                </div>
                {displayArrow && (
                    <div className="toOpenBlock">
                        <p className="pBlock">{isOpen ? "▶" : "▼"}</p>
                    </div>
                )}
            </div>
            {isOpen && renderRecursif(value)}
        </>
    );
};

export default Block;
