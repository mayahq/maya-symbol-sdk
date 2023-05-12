
import type { OnMessageCallback, Properties, Metadata, Wires, PrimitiveTypes, TypedMetadata, SymbolType, Children, Schema, SymbolImpl } from "./Symbol.d.ts"
import evaluateSymbolProperty from "../utils/evaluateSymbolProperties.ts";
import generateId from "../utils/generateId.ts";
import {TypedInput} from "../mods.ts"



class Symbol implements SymbolImpl {
    static paletteLabel = "";
    static type = "";
    static isConfig = false;
    static category = "";
    static schema?: Schema = {
        inputSchema: {},
        outputSchema: {},
        propertiesSchema: {}
    }
    static description = "";
    
    id = "";
    editorLabel = "";
    children?: Children = {
        wires: {
            in: [[]],
            out: [[]]
        },
        symbols: []
    };
    properties: Properties = {};
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
    wires: Wires = [[]];

    runtime: unknown;

    constructor(runtime: unknown | undefined, args: SymbolImpl) {
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
        }
    }

    async _runtimeMessageHandler(msg:Record<string, unknown>, callback: OnMessageCallback): Promise<void> {
        const vals: Record<string, any> = evaluateSymbolProperty(this, msg)
        await this.onMessage(msg, vals, callback)
        
    }
    async onInit(_callback: OnMessageCallback): Promise<void> {
        this.evaluatePropertyMetadata(this)
    }

    private async onMessage(_msg: Record<string, any>, _vals: Record<string, any>, _callback: OnMessageCallback): Promise<OnMessageCallback> {
        return new Promise(_callback)
    }

    private evaluatePropertyMetadata(symbol: Symbol) : {[name:string]:TypedMetadata} | undefined  {
        const evaluated:{[name:string]:TypedMetadata} | undefined = Symbol!["schema"]!["propertiesSchema"];
        if(Symbol.schema && Symbol.schema.propertiesSchema){
            Object.entries(symbol.properties).forEach(([property, propVal]) => {
                try{ 
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
                    console.error(`Error evaluating ${property} in ${symbol.id}:${Symbol.type}:${Symbol.name}`, error)
                    throw error
                }
            });
        }
        return evaluated;
    }

    static toJSON(dsl: SymbolType): string {
        function dummy(){}
        const symRepr: SymbolImpl = {
            editorLabel: dsl.editorLabel ? dsl.editorLabel: this.name,
            properties: dsl.properties,
            wires: dsl.wires ? dsl.wires : [[]],
            children: dsl.children ? dsl.children : {
                wires: {
                    in: [[]],
                    out: [[]]
                },
                symbols: []
            },
            metadata: dsl.metadata ? dsl.metadata: {}
        }
        const sym: Symbol = new Symbol(dummy, symRepr)
        const out: SymbolType = {
            id: generateId(),
            type: this.type,
            category: this.category,
            isConfig: this.isConfig,
            editorLabel: sym.editorLabel,
            paletteLabel: this.paletteLabel,
            description: this.description,
            properties: sym.properties,
            schema: this.schema,
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