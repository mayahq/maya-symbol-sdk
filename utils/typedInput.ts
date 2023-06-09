import { lodash } from "../deps.ts";
import { Symbol } from "../mod.ts";
import { TypedInputArgs, ComponentTypes, ListInputTypes, TypedInputTypes, TypedMetadata, ValueType, PropertyObject } from "../src/Symbol.d.ts";
import Fields from "./fields.ts";

class TypedInput extends Fields {
    value: ValueType = "";
    type: TypedInputTypes = "str";
    label?: string;
    component?: ComponentTypes = "input";
    allowedTypes?: ListInputTypes = ["str", "msg", "global"];
    allowInput?: boolean = true;
    width?: string;
    placeholder?: string;
    defaultValue?: ValueType = ""
    
    constructor(input:TypedInputArgs){
        super()
        this.type = input.type
        if(input.value) {
            this.value = input.value
        }
        switch(input.type){
            case "str":
            case "num":
            case "bool":
            case "date":
            case "re":
            case "msg":
            case "global":
            case "password":
            case "bin":{
                this["component"] = "input"
                break;
            }
            case "config":{
                this["component"] = "select-config"
                break;
            }
            case "json":
            case "jsonata": {
                this["component"] = "input-json"
                break;
            }
                
        }
        if(input.label){
            this!["label"] = input.label;
        }
        if(input.allowedTypes){
            this!["allowedTypes"] = input.allowedTypes;
        }
        if(input.allowInput){
            this!["allowInput"] = input.allowInput;
        }
        if(input.width){
            this!["width"] = input.width;
        }
        if(input.placeholder){
            this!["placeholder"] = input.placeholder;
        }
    }

    evaluateField(symbol: Symbol, msg: Record<string, unknown>): PropertyObject {
        const evaluated: PropertyObject = {
            type: "str",
            value: ""
        }
        switch(this.type){
            case "str":
            case "num":
            case "bool":
            case "date":
            case "re":
            case "password":
            case "bin":
            case "json":
            case "jsonata":
            case "config": {
                    evaluated.type = this.type;
                    evaluated.value = this.value;
                    break;
                }
            case "global":{
                const keyDepth: string[] = (this.value?.toString() || "").split(".") || [];
                evaluated.type = this.type;
                // evaluated.value = lodash.get(symbol.runtime!["storage"]!["internal"], keyDepth);
                break;
            }
            case "msg":{
                const keyDepth: string[] = (this.value?.toString() || "").split(".") || [];
                evaluated.type = this.type;
                evaluated.value = lodash.get(msg, keyDepth);
                break;
            }
        }
        return evaluated
    }

    generateSchema(propertyName: string, field: TypedInput): TypedMetadata {
        const result: TypedMetadata = {
            component: field.component || "str",
            label: field.label || propertyName,
            options: {
                allowedTypes: field.allowedTypes,
                allowInput: field.allowInput,
                defaultValue: field.defaultValue,
                placeholder: field.placeholder,
                width: field.width
            }
        }
        return result
    }

}

export default TypedInput