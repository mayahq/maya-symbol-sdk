
import { OnMessageCallback, ChildWires, Properties, Metadata, Wires } from "../deps.ts";
import utils from "../utils/index.ts";

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