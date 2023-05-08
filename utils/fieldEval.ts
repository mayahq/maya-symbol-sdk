import { lodash } from "../deps.ts";
import UnmatchedDataTypeException from "./exceptions.ts";
function fieldEval(key: string, type: string, rootObj: unknown): unknown {
    const keyDepth: string[] = key.split(".") || [key];
    switch (type) {
        case "str":{
            if(typeof rootObj === "string"){
                return rootObj
            } else {
                throw new UnmatchedDataTypeException("Mismatched type")
            }
        }
        case "num":{
            if(typeof rootObj === "number"){
                return rootObj
            } else {
                throw new UnmatchedDataTypeException("Mismatched type")
            }
        }
        case "bool":{
            if(typeof rootObj === "boolean"){
                return rootObj
            } else {
                throw new UnmatchedDataTypeException("Mismatched type")
            }
        }
        case "json":{
            try{
                //@ts-ignore
                return JSON.parse(rootObj)
            } catch (err){
                throw new UnmatchedDataTypeException("Mismatched type")
            }
        }
        case "msg": {
            try{
                return lodash.get(rootObj, keyDepth)
            } catch (err){
                throw new UnmatchedDataTypeException("Mismatched type")
            }
        }
    }
}

export default fieldEval