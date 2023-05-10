
import { OnMessageCallback, ChildWires, Properties, Metadata, Wires, PrimitiveTypes, TypedInput, TypedMetadata } from "../deps.ts";
import evaluateSymbolProperty from "../utils/evaluateSymbolProperties.ts";

interface Children {
    wires: ChildWires,
    symbols: Symbol[]
};

interface Schema {
    inputSchema: {
        [name:string]: PrimitiveTypes;
    }
    propertiesSchema: {
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
    schema: Schema = {
        inputSchema: {},
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
        metadata: Metadata,
        description?: string,
        schema: {
            inputSchema: {
                [name: string]: {
                    type: PrimitiveTypes,
                }
            },
            propertiesSchema: {
                [name: string]: {
                    metadata?: Record<string, unknown> 
                }
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
            for (const [key, obj] of Object.entries(symbolRepr.properties)){
                this.properties[key] = symbolRepr.properties[key]
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

    _evaluatePropertyMetadata(symbol: Symbol): Record<string, unknown> {
        const evaluated:{[name:string]:TypedMetadata} = this.schema.propertiesSchema;
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
                            evaluated[property] = propertySchemaInner
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
                            evaluated[property].component = "input";
                            evaluated[property].label = propVal.metadata?.label || property;
                            evaluated[property].options = propVal.metadata?.options || {};
                            //@ts-ignore: these won't be undefined
                            evaluated[property].options?.allowInput = propVal.metadata?.options?.allowInput ? propVal.metadata?.options?.allowInput : true;
                            //@ts-ignore: these won't be undefined
                            evaluated[property].options?.allowedTypes = propVal.metadata?.options?.allowedTypes ? propVal.metadata?.options?.allowedTypes: ["msg", "global", "str"];
                            //@ts-ignore: these won't be undefined
                            evaluated[property].options?.defaultValues = propVal.metadata?.options?.defaultValues ? propVal.metadata?.options?.defaultValues : "";
                            //@ts-ignore: these won't be undefined
                            evaluated[property].options?.placeholder = propVal.metadata?.options?.placeholder ? propVal.metadata?.options?.placeholder: "";
                            //@ts-ignore: these won't be undefined
                            evaluated[property].options?.width = propVal.metadata?.options?.width ? propVal.metadata?.options?.width : "40px";
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
        return evaluated;
    }
}

export default Symbol