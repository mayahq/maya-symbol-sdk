import {Symbol} from "../mods.ts";
import { PrimitiveTypes } from "../src/Symbol.d.ts";
import exceptions from "./exceptions.ts";
import { lodash } from "../deps.ts";

function evaluateSymbolProperty(symbol: Symbol, dynamicObject?: Record<string, unknown>): Record<string, unknown> {
    const evaluated: Record<string, unknown> = {}
    Object.entries(symbol.properties).forEach(([property, propVal]) => {
        try {
            const type: PrimitiveTypes = propVal.type;
            switch (type) {
                case "str": {
                    evaluated[property] = propVal.value 
                    break;
                }
                case "bool": {
                    if (propVal.value === "true"){
                        evaluated[property] = true
                    } else if (propVal.value === "false") {
                        evaluated[property] = "false"
                    } else {
                        console.error(`Property ${property} is not set as correct boolean symbol`)
                        throw new exceptions.UnmatchedDataTypeException("Not a")
                    }
                    break;
                }
                case "num": {
                    try {
                        const num = Number(propVal.value)
                        evaluated[property] = num
                    } catch (error) {
                        console.error(`Error parsing ${property} to numeric value`)
                        throw error
                    }
                    break;
                }
                case "json": {
                    try {
                        if(typeof propVal.value !== "undefined"){
                            const obj = JSON.parse(propVal.value?.toString() || "");
                            evaluated[property] = obj
                        } else {
                            console.error(`Error parsing ${property} to as JSON object`)
                            throw new Error("not a valid JSON input");
                        }
                    } catch (error) {
                        console.error(`Error parsing ${property} to as JSON object`)
                        throw error;
                    }
                    break;
                }
                case "msg": {
                    const keyDepth: string[] = (symbol.properties[property].value?.toString() || "").split(".")
                    if(keyDepth[0]){
                        evaluated[property] = lodash.get(dynamicObject, keyDepth)
                    } else {
                        evaluated[property] = undefined
                    }
                    break;
                }
                case "global":{
                    const keyDepth: string[] = (symbol.properties[property].value?.toString() || "").split(".")
                    if(keyDepth[0]){
                        //@ts-ignore: "Runtime object definition is TBD"
                        evaluated[property] = lodash.get(symbol.runtime.storage.global, keyDepth)
                    } else {
                        evaluated[property] = undefined
                    }
                    break;
                }
                default: {
                    console.log("No match");
                    return undefined
                }
            }
        } catch (error) {
            console.error(`Error evaluating ${property} in ${symbol.id}:${Symbol.type}:${Symbol.name}`, error)
            throw error
        }
    })
    return evaluated;
}

export default evaluateSymbolProperty