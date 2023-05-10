import TypedInput from './utils/typedInputs.ts';
// @deno-types="npm:@types/lodash@4.14.194"
export interface OnMessageCallback { (done: unknown): void}

export type GenericArray<T=unknown> = Array<T>

export type PrimitiveTypes = 'str' | 'num' | 'bool' | 'json' | 'date' | 'msg' | 'global' | 're' | 'jsonata' | 'password' | 'bin' | 'select' | 'checkbox' | 'radio' | 'config';

export type ListPrimitiveTypes = Array<PrimitiveTypes>
export interface SchemaOption {
    title: string;
    allowInput: boolean;
    placeholder?: string;
    types?: ListPrimitiveTypes
}
export interface Schema {
    label: string;
    options?: SchemaOption | SchemaOption[]
}

export interface PropInner {
    value: string | number | boolean;
    type: PrimitiveTypes;
    metadata?: Record<string, unknown>;
}
export interface Properties {
    [name: string]: PropInner | TypedInput;
}

export type Wires = string[][]
export interface ChildWires {
    in: string[][]
    out: string[][]
}
export type Position = {
    x: number
    y: number
}
export type Metadata = {
    position: Position;
    step_id: string;
    tmp_id: string;
    prefix: string;
} | Record<string, never>

export {default as lodash} from 'npm:lodash@4.17.21'
export {default as evaluateSymbolProperties } from './utils/evaluateSymbolProperties.ts'
export {default as exceptions} from './utils/exceptions.ts'