
import { OnMessageCallback, ChildWires, Properties, Metadata, Wires, PrimitiveTypes } from "../deps.ts";
import evaluateSymbolProperty from "../utils/evaluateSymbolProperties.ts";

interface Children {
    wires: ChildWires,
    symbols: Symbol[]
};

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
    } | undefined) {
        this.runtime = runtime;
        if(symbolRepr){
            this.id = symbolRepr.id;
            this.name = symbolRepr.name;
            this.type = symbolRepr.type;
            for (const [key, obj] of Object.entries(symbolRepr.properties)){
                this.properties[key] = {
                    "value": symbolRepr.properties[key]["value"],
                    "type": symbolRepr.properties[key]["type"]
                }
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
        }
    }

    onInit(callback: OnMessageCallback): void {

    }

    private _messageHandler(callback: OnMessageCallback, msg:Record<string, unknown>): void {
        const vals: Record<string, unknown> = evaluateSymbolProperty(this, msg)
        this.onMessage(callback, msg, vals)
    }
    
    onMessage(callback: OnMessageCallback, msg: Record<string, unknown>, vals: unknown): void {
        
    }
}

export default Symbol