
import { OnMessageCallback, ChildWires, Properties, Metadata, Wires, PrimitiveTypes, TypedInput, TypedMetadata } from "../deps.ts";
import evaluateSymbolProperty from "../utils/evaluateSymbolProperties.ts";
import generateId from "../utils/generateId.ts";

interface Children {
    wires: ChildWires,
    symbols: Symbol[] | []
};
type ToJSON = {
    id: string;
    name: string;
    type: string;
    description: string;
    isConfig: boolean;
    category: string;
    properties: Properties;
    children?: Children;
    metadata?: Metadata;
    schema?: Schema;
    wires: Wires;
}

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
    isConfig = false;
    category = "";
    properties: Properties = {};
    children?: Children = {
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
        tmp_id: "",
        color: "",
        icon: ""
    };
    schema?: Schema = {
        inputSchema: {},
        outputSchema: {},
        propertiesSchema: {}
    }
    wires: Wires = [[]];
    description = "";

    runtime: unknown;

    constructor(runtime: unknown | undefined, symbolRepr: {
        name: string,
        type: string,
        category: string,
        isConfig: boolean,
        properties: Properties,
        wires: Wires,
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
        },
        children?:Children

    } | undefined) {
        this.runtime = runtime;
        if(symbolRepr){
            this.id = generateId();
            this.name = symbolRepr.name;
            this.type = symbolRepr.type;
            this.isConfig = symbolRepr.isConfig;
            this.category = symbolRepr.category ? symbolRepr.category : this.category;
            for (const [key, obj] of Object.entries(symbolRepr.properties)){
                this.properties[key].value = symbolRepr.properties[key].value
                this.properties[key].type = symbolRepr.properties[key].type
            }
            this.children = symbolRepr?.children || {
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
                tmp_id: "",
                color: "",
                icon: ""
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

    private _messageHandler(msg:Record<string, unknown>, callback: OnMessageCallback, result = false): void | unknown {
        const vals: Record<string, unknown> = evaluateSymbolProperty(this, msg)
        return this.onMessage(callback, msg, vals, result)
    }
    
    onMessage(callback: OnMessageCallback, msg: Record<string, unknown>, vals: unknown, result = false): void | unknown {
        return msg
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

    static toJSON(properties: Properties, name?:string, isConfig?:boolean, description?: string, category?: string, wires?: Wires): string {
        function dummy(){}
        const symRepr = {
            name: name ? name: this.name,
            type: "",
            isConfig: isConfig ? isConfig : false,
            description: description ? description: "",
            properties: properties,
            category: category ? category: "",
            wires: wires ? wires : [[]]
        }
        const sym: Symbol = new Symbol(dummy, symRepr)
        const out: ToJSON = {
            id: sym.id,
            name: sym.name,
            type: sym.type,
            isConfig: sym.isConfig,
            category: sym.category,
            description: sym.description,
            properties: sym.properties,
            schema: sym.schema,
            children: sym.children,
            metadata: sym.metadata,
            wires: sym.wires
        }
        return JSON.stringify(out, null, 2);
    }

    static fromJSON(symbolRepr: string, callback?: OnMessageCallback): Symbol {
        function dummy(){}
        try {
            const parsed: {
                name: string,
                type: string,
                category: string,
                isConfig: boolean,
                properties: Properties,
                wires: Wires,
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
                },
                children?:Children
        
            } = JSON.parse(symbolRepr)
            const sym: Symbol = new Symbol(callback ? callback : dummy, parsed)
            return sym
        } catch (error) {
            throw error
        }
    }

    run(args: Record<string, unknown>, callback?: OnMessageCallback): unknown {
        function compareObjects(obj1: any, obj2: any): boolean {
            for (let key in obj1) {
                if (!(key in obj2)) {
                    return false;
                }
                const value1 = obj1[key];
                const value2 = obj2[key];
                if (typeof value1 === "object" && typeof value2 === "object") {
                    const result = compareObjects(value1, value2);
                    if (result !== null) {
                        return result;
                    }
                }
            }
            return true; // Objects match, no error
        }
        if(!compareObjects(this.schema?.inputSchema, args)){
            console.warn(`Input type does not match the expected type`)
        }
        function dummy(){}
        const result = this._messageHandler(args, callback ? callback : dummy);
        return result
    }
}

export default Symbol