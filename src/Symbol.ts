
import { OnMessageCallback, ChildWires, Properties, Metadata, Wires, PrimitiveTypes, TypedInput, TypedMetadata } from "../deps.ts";
import evaluateSymbolProperty from "../utils/evaluateSymbolProperties.ts";

interface Children {
    wires: ChildWires,
    symbols: Symbol[]
};

interface Schema {
    inputSchema?: {
        [name:string]: {
            type: unknown;
            description: string;
        };
    }
    outputSchema?: {
        [name:string]: {
            type: unknown;
            description: string;
        };
    }
    propertiesSchema?: {
        [name:string]: TypedMetadata
    }
}

class Symbol {
    id = "";
    name = "";
    type = "";
    properties: Properties = {};
    children: Children = {
        wires: {
            in: [[]],
            out: [[]]
        },
        symbols: []
    };
    metadata: Metadata = {
        position: {
            x: 0,
            y: 0
        },
        prefix: "",
        step_id: "",
        tmp_id: ""
    };
    schema?: Schema = {
        inputSchema: {},
        outputSchema: {},
        propertiesSchema: {}
    }
    wires: Wires = [[]]
    description = "";

    runtime: unknown;

    constructor(runtime: unknown | undefined, symbolRepr: {
        id: string,
        name: string,
        type: string,
        properties: {
            [name: string]: {
                value: string,
                type: PrimitiveTypes
            }
        },
        wires: [[]],
        metadata?: Metadata,
        description?: string,
        schema?: {
            inputSchema?: {
                [name: string]: {
                    type: unknown;
                    description: string;
                };
            },
            outputSchema?: {
                [name: string]: {
                    type: unknown;
                    description: string;
                };
            }
            propertiesSchema?: {
                [name: string]:  Record<string, unknown>;
            }
        }
    } | undefined) {
        this.runtime = runtime;
        if(symbolRepr){
            this.id = symbolRepr.id;
            this.name = symbolRepr.name;
            this.type = symbolRepr.type;
            for (const [key, obj] of Object.entries(symbolRepr.properties)){
                this.properties[key].value = symbolRepr.properties[key].value
                this.properties[key].type = symbolRepr.properties[key].type
            }
            this.children = {
                wires: {
                    in:[[]],
                    out: [[]]
                },
                symbols: []
            }
            this.wires = [[]];
            this.metadata = symbolRepr.metadata || {
                position: {
                    x: 0,
                    y: 0
                },
                prefix: "",
                step_id: "",
                tmp_id: ""
            };
            this.description = symbolRepr.description || "";
            if(symbolRepr.schema){
                if(symbolRepr.schema.inputSchema){
                    for (const [key, obj] of Object.entries(symbolRepr!["schema"]!["inputSchema"]!)){
                        this!["schema"]!["inputSchema"]![key].type = symbolRepr!["schema"]!["inputSchema"]![key].type
                        this!["schema"]!["inputSchema"]![key].description = symbolRepr!["schema"]!["inputSchema"]![key].description
                    }
                }
                if(symbolRepr.schema.outputSchema){
                    for (const [key, obj] of Object.entries(symbolRepr!["schema"]!["outputSchema"]!)){
                        this!["schema"]!["outputSchema"]![key].type = symbolRepr!["schema"]!["outputSchema"]![key].type
                        this!["schema"]!["outputSchema"]![key].description = symbolRepr!["schema"]!["outputSchema"]![key].description
                    }
                }
            }
        }
    }

    onInit(callback: OnMessageCallback): void {
        this._evaluatePropertyMetadata(this)
    }

    private _messageHandler(callback: OnMessageCallback, msg:Record<string, unknown>): void {
        const vals: Record<string, unknown> = evaluateSymbolProperty(this, msg)
        this.onMessage(callback, msg, vals)
    }
    
    onMessage(callback: OnMessageCallback, msg: Record<string, unknown>, vals: unknown): void {
        
    }

    _evaluatePropertyMetadata(symbol: Symbol): {[name:string]:TypedMetadata} | undefined  {
        const evaluated:{[name:string]:TypedMetadata} | undefined = this!["schema"]!["propertiesSchema"];
        if(this.schema && this.schema.propertiesSchema){
            Object.entries(symbol.properties).forEach(([property, propVal]) => {
                try {
                    const type: PrimitiveTypes = propVal.type;
                    if(!(propVal instanceof TypedInput)){
                        switch (type) {
                            case "str":
                            case "bool":
                            case "num": 
                            case "json": {
                                const propertySchemaInner: TypedMetadata = {
                                    label: property,
                                    component: "input"
                                }
                                evaluated![property] = propertySchemaInner
                                break;
                            }
                            default: {
                                console.log("No match");
                                return undefined
                            }
                        }
                    } else {
                        switch (type) {
                            case "str":
                            case "bool":
                            case "num": 
                            case "json":
                            case "msg":
                            case "global":{
                                evaluated![property].component = "input";
                                evaluated![property].label = propVal?.label || property;
                                evaluated![property].options = propVal?.options || {};
                                evaluated![property]!["options"]!["allowInput"] = propVal?.options?.allowInput ? propVal?.options?.allowInput : true;
                                evaluated![property]!["options"]!["allowedTypes"] = propVal?.options?.allowedTypes ? propVal?.options?.allowedTypes: ["msg", "global", "str"];
                                evaluated![property]!["options"]!["defaultValues"] = propVal?.options?.defaultValues ? propVal?.options?.defaultValues : "";
                                evaluated![property]!["options"]!["placeholder"] = propVal?.options?.placeholder ? propVal?.options?.placeholder: "";
                                evaluated![property]!["options"]!["width"] = propVal?.options?.width ? propVal?.options?.width : "40px";
                                break;
                            }
                            default: {
                                console.log("No match");
                                return undefined
                            }
                        }
                    }
                } catch (error) {
                    console.error(`Error evaluating ${property} in ${symbol.id}:${symbol.type}:${symbol.name}`, error)
                    throw error
                }
            });
        }
        return evaluated;
    }
}

export default Symbol