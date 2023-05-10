import { PrimitiveTypes, ListPrimitiveTypes, GenericArray } from "../deps.ts";

type SelectOption = {
    label: string;
    value: string;
}

type TypedInputArgs = {
    type: PrimitiveTypes;
    value: string | TypedInput;
    allowedTypes?: ListPrimitiveTypes;
    defaultValue?: string | TypedInput;
    options?: GenericArray<string> | GenericArray<SelectOption> | GenericArray<TypedInput>;
    label?: string;
    width?: string;
    placeholder?: string;
    allowInput?: boolean;
}

class TypedInput {
    value: string | TypedInput;
    type: PrimitiveTypes;
    metadata?: Record<string, unknown> = {};
    // allowedTypes: ListPrimitiveTypes;
    
    constructor(input:TypedInputArgs){
        if(input.value && input.type) {
            this.value = input.value ? input.value : input.defaultValue || "";
            this.type = input.type
        } else {
            this.value = ""
            this.type = "str"
        }
        this.metadata =  {schema: {}, component: ""};
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
        if(input.allowedTypes){
            //@ts-ignore: metadata content
            this.metadata["schema"]["allowedTypes"] = input.allowedTypes;
        } else {
            //@ts-ignore: metadata content
            this.metadata["schema"]["allowedTypes"] = ["str", "msg", "global"];
        }
        if(input.options){
            //@ts-ignore: metadata content
            this.metadata["schema"]["options"] = input.options;
        }
        if(input.label){
            //@ts-ignore: metadata content
            this.metadata["schema"]["label"] = input.label;
        }
        if(input.allowInput){
            //@ts-ignore: metadata content
            this.metadata["schema"]["allowInput"] = input.allowInput;
        }
        if(input.width){
            //@ts-ignore: metadata content
            this.metadata["schema"]["width"] = input.width;
        }
        if(input.placeholder){
            //@ts-ignore: metadata content
            this.metadata["schema"]["placeholder"] = input.placeholder;
        }
    }

}

export default TypedInput