import { PrimitiveTypes, TypedMetadata, TypedInputArgs } from "../deps.ts";

class TypedInput {
    value: string | TypedInput;
    type: PrimitiveTypes;
    metadata?: TypedMetadata;
    
    constructor(input:TypedInputArgs){
        if(input.value && input.type) {
            this.value = input.value ? input.value : input.defaultValue || "";
            this.type = input.type
        } else {
            this.value = ""
            this.type = "str"
        }
        this.metadata =  {
            component: ""
        };
        switch(input.type){
            case "str":
            case "num":
            case "bool":
            case "json":
            case "date":
            case "re":
            case "msg":
            case "global":
            case "bin":{
                this.metadata["component"] = "input"
                break;
            }
            case "password": {
                this.metadata["component"] = "password"
                break;
            }
            case "select": {
                this.metadata["component"] = "select"
                break;
            }
            case "radio": {
                this.metadata["component"] = "radio"
                break;
            }
            case "checkbox": {
                this.metadata["component"] = "checkbox"
                break;
            }
        }
        if(input.label){
            //@ts-ignore: metadata content
            this.metadata["label"] = input.label;
        }
        if(input.options){
            this.metadata!["options"] = input.options;
            if(input.allowedTypes){
                this.metadata!["options"]!["allowedTypes"] = input.allowedTypes;
            } else {
                this.metadata!["options"]!["allowedTypes"] = ["str", "msg", "global"];
            }
            if(input.allowInput){
                this.metadata!["options"]!["allowInput"] = input.allowInput;
            }
            if(input.width){
                this.metadata!["options"]!["width"] = input.width;
            }
            if(input.placeholder){
                this.metadata!["options"]!["placeholder"] = input.placeholder;
            }
        }
    }

}

export default TypedInput