
import type { OnMessageCallback, Properties, Metadata, Wires, PrimitiveTypes, TypedMetadata, SymbolType, Children, Schema, ToJSON } from "./Symbol.d.ts"
import evaluateSymbolProperty from "../utils/evaluateSymbolProperties.ts";
import generateId from "../utils/generateId.ts";
import {TypedInput} from "../mods.ts"

class Symbol implements SymbolType{
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

    constructor(runtime: unknown | undefined, args: SymbolType) {
        this.runtime = runtime;
        if(args){
            for (const [key, obj] of Object.entries(args.properties)){
                this.properties[key].value = args.properties[key].value
                this.properties[key].type = args.properties[key].type
            }

            this.children = args?.children || {
                wires: {
                    in:[[]],
                    out: [[]]
                },
                symbols: []
            }
            this.wires = [[]];
            this.metadata = args.metadata || {
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
            this.description = args.description || "";
        }
    }

    onInit(callback: OnMessageCallback): void {
        this._evaluatePropertyMetadata(this)
    }

    private _messageHandler(msg:Record<string, unknown>, callback: OnMessageCallback): void {
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

    static toJSON(properties: Properties, name?:string, isConfig?:boolean, description?: string, category?: string, wires?: Wires): string {
        function dummy(){}
        const symRepr: SymbolType = {
            id: generateId(),
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
            const parsed: SymbolType = JSON.parse(symbolRepr)
            const sym: Symbol = new Symbol(callback ? callback : dummy, parsed)
            return sym
        } catch (error) {
            throw error
        }
    }
}

export default Symbol