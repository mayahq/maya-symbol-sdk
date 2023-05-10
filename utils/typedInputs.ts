import { PrimitiveTypes, ListPrimitiveTypes, GenericArray } from "../deps.ts";

type SelectOption = {
    label: string;
    value: string;
}

type TypedInputArgs = {
    type: PrimitiveTypes;
    value: string | TypedInput;
    allowedTypes?: ListPrimitiveTypes
    defaultValue?: string | TypedInput;
    options?: GenericArray<string> | GenericArray<SelectOption> | GenericArray<TypedInput>

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
        this.metadata =  {};
        if(input.allowedTypes){
            this.metadata["allowedTypes"] = input.allowedTypes;
        } else {
            this.metadata["allowedTypes"] = ["str", "msg", "global"];
        }
        if(input.options){
            this.metadata["options"] = input.options;
        }
    }

}

export default TypedInput