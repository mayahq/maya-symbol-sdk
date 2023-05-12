import type {TypedInput} from "../mods.ts";

export interface OnMessageCallback { (done: unknown): void}

export type GenericArray<T=unknown> = Array<T>

export type PrimitiveTypes = 'str' | 'num' | 'bool' | 'json' | 'date' | 'msg' | 'global' | 're' | 'jsonata' | 'password' | 'bin' | 'select' | 'checkbox' | 'radio' | 'config';

export type ComponentTypes = 'input' | 'select' | 'checkbox' | 'radio' | 'toggle' | 'editable-table';

export type ListPrimitiveTypes = Array<PrimitiveTypes>
export type TypedInputArgs = {
    type: PrimitiveTypes;
    value: string | TypedInput;
    allowedTypes?: ListPrimitiveTypes;
    defaultValue?: string | TypedInput;
    options?: TypedInputOptions;
    label?: string;
    width?: string;
    placeholder?: string;
    allowInput?: boolean;
}

export type TypedInputOptions = {
    allowedTypes?: ListPrimitiveTypes;
    defaultValues?: string | TypedInput;
    width?: string;
    placeholder?: string;
    allowInput?: boolean
}

export type TypedMetadata = {
    component: string;
    label?: string;
    options?: TypedInputOptions
}
export interface Properties {
    [name: string]: {
        value: string,
        type: PrimitiveTypes
    } | TypedInput
}

export type Wires = Array<Array<string>> | [[]];
export interface ChildWires {
    in: Array<Array<string>> | [[]];
    out: Array<Array<string>> | [[]];
}
export type Position = {
    x: number
    y: number
}
export type Metadata = {
    position?: Position;
    step_id?: string;
    tmp_id?: string;
    prefix?: string;
    color?: string;
    icon?: string;
} | Record<string, unknown>

interface Children {
    wires: ChildWires,
    symbols: SymbolType[] | []
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

export interface SymbolImpl {
    editorLabel?: string;
    properties: Properties;
    children?: Children;
    metadata?: Metadata;
    wires: Wires;
}

type SymbolStatic = {
    id: string;
    type: string;
    paletteLabel: string;
    description: string;
    isConfig: boolean;
    category: string;
    properties: Properties;
    children?: Children;
    metadata?: Metadata;
    schema?: Schema;
}

export interface SymbolType extends SymbolImpl, SymbolStatic {}