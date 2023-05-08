
import { OnMessageCallback } from "../deps.ts";
type GenericObject = Record<string, unknown>;
type Properties = GenericObject;
type Wires = string[][]
interface ChildWires {
    in: string[][]
    out: string[][]
}
interface Children {
    wires: ChildWires,
    symbol: Symbol[]
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
    properties: Properties = {};
    children: Children = {
        wires: {
            in: [[]],
            out: [[]]
        },
        symbol: []
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

    constructor(runtime: unknown) {
        this.runtime = runtime
    }

    onInit(callback: OnMessageCallback): void {

    }

    onMessage(callback: OnMessageCallback, msg: Record<string, unknown>, vals: Record<string, unknown>): void {

    }
}

export default Symbol