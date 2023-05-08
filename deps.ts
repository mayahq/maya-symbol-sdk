// @deno-types="npm:@types/lodash@4.14.194"
export interface OnMessageCallback { (done: unknown): void}
export interface SchemaOption {
    title: string;
    allowInput: boolean;
    placeholder?: string;
    types?: string[];
}
export interface Schema {
    label: string;
    options?: SchemaOption | SchemaOption[]
}

export interface PropInner {
    category: string;
    color: string;
    component: string;
    schema: Schema
}
export interface Properties {
    [name: string]: PropInner;
}

export type Wires = string[][]
export interface ChildWires {
    in: string[][]
    out: string[][]
}
export type Position = {
    x: number
    y: number
    z: number
}
export interface Metadata {
    position: Position;
    step_id: string;
    tmp_id: string;
    prefix: string;
}

export {default as lodash} from 'npm:lodash@4.17.21'
export {default as mayautils} from "./utils/index.ts"