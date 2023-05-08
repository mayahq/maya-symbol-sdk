
import { OnMessageCallback } from "../deps.ts";
import utils from "../utils/index.ts";
type GenericObject = Record<string, unknown>;

interface SchemaOption {
    title: string;
    allowInput: boolean;
    placeholder?: string;
    types?: string[];
}
interface Schema {
    label: string;
    options?: SchemaOption[]
}
interface Fields {
    component: string;
    schema: Schema
}
type Properties = {
    name: string;
    category: string;
    color: string;
    fields: Fields
};
type Wires = string[][]
interface ChildWires {
    in: string[][]
    out: string[][]
}
interface Children {
    wires: ChildWires,
    symbols: Symbol[]
};
type Position = {
    x: number
    y: number
    z: number
}
interface Metadata {
    position: Position;
    step_id: string;
    tmp_id: string;
    prefix: string;
}

class Symbol {
    id = "";
    name = "";
    type = "";
    properties: Properties = {
        name: "",
        category: "",
        color: "",
        fields: {
            component: "",
            schema: {
                label: "",
                options:[]
            }
        }
    };
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
            y: 0, 
            z: 0
        },
        prefix: "",
        step_id: "",
        tmp_id: ""
    };
    wires: Wires = [[]]
    description = "";

    runtime: unknown;
    utils: Record<string, object> = {
        exceptions:{
            UnmatchedDataTypeException: utils.UnmatchedDataTypeException
        },
        fieldEval: utils.fieldEval
    }

    constructor(runtime: unknown) {
        this.runtime = runtime
    }

    onInit(callback: OnMessageCallback): void {

    }

    onMessage(callback: OnMessageCallback, msg: Record<string, unknown>): void {

    }
}

export default Symbol