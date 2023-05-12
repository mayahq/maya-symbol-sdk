import { PrimitiveTypes, TypedInputArgs, ComponentTypes, ListPrimitiveTypes, TypedInputOptions } from "../src/Symbol.d.ts";

class TypedInput {
    value: string | TypedInput;
    type: PrimitiveTypes = "str";
    label?: string;
    component?: ComponentTypes = "input";
    allowedTypes?: ListPrimitiveTypes = ["str", "msg", "global"];
    allowedInput?: boolean = true;
    options?: TypedInputOptions = {};
    width?: string;
    placeholder?: string;
    
    constructor(input:TypedInputArgs){
        if(input.value && input.type) {
            this.value = input.value ? input.value : input.defaultValue || "";
            this.type = input.type
        } else {
            this.value = ""
            this.type = "str"
        }

        switch(input.type){
            case "str":
            case "num":
            case "bool":
            case "json":
            case "date":
            case "re":
            case "msg":
            case "global":
            case "password":
            case "bin":{
                this["component"] = "input"
                break;
            }
            case "select": {
                this["component"] = "select"
                break;
            }
            case "radio": {
                this["component"] = "radio"
                break;
            }
            case "checkbox": {
                this["component"] = "checkbox"
                break;
            }
        }
        if(input.label){
            this!["label"] = input.label;
        }
        if(input.options){
            this!["options"] = input.options;
            if(input.allowedTypes){
                this!["options"]!["allowedTypes"] = input.allowedTypes;
            }
            if(input.allowInput){
                this!["options"]!["allowInput"] = input.allowInput;
            }
            if(input.width){
                this!["options"]!["width"] = input.width;
            }
            if(input.placeholder){
                this!["options"]!["placeholder"] = input.placeholder;
            }
        }
    }

}

export default TypedInput