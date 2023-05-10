//@ts-ignore: not sure why there was a warning
import TypedInput from './utils/typedInput.ts';
// @deno-types="npm:@types/lodash@4.14.194"
export interface OnMessageCallback { (done: unknown): void}

export type GenericArray<T=unknown> = Array<T>

export type PrimitiveTypes = 'str' | 'num' | 'bool' | 'json' | 'date' | 'msg' | 'global' | 're' | 'jsonata' | 'password' | 'bin' | 'select' | 'checkbox' | 'radio' | 'config';

export type ComponentTypes = 'input' | 'select' | 'checkbox' | 'radio' | 'toggle' | 'editable-table';

export type ListPrimitiveTypes = Array<PrimitiveTypes>
// export interface PropertySchemaOption {
//     allowedTypes?: ListPrimitiveTypes;
//     defaultValues?: string | TypedInput;
//     width?: string;
//     placeholder?: string;
//     allowInput?: boolean
// }
// export interface PropertySchemaInner {
//     label: string;
//     component: ComponentTypes;
//     options?: PropertySchemaOption | PropertySchemaOption[]
// }

// export interface PropertySchema {
//     [name: string]: PropertySchemaInner;
// }

type SelectOption = {
    label: string;
    value: string;
}
export type TypedInputArgs = {
    type: PrimitiveTypes;
    value: string | TypedInput;
    allowedTypes?: ListPrimitiveTypes;
    defaultValue?: string | TypedInput;
    options?: GenericArray<string> | GenericArray<SelectOption> | GenericArray<TypedInput>;
    label?: string;
    width?: string;
    placeholder?: string;
    allowInput?: boolean;
}

export type TypedMetadataOptions = {
    allowedTypes?: ListPrimitiveTypes;
    defaultValues?: string | TypedInput;
    width?: string;
    placeholder?: string;
    allowInput?: boolean
}

export type TypedMetadata = {
    component: string;
    label?: string;
    options?: TypedMetadataOptions
}
export interface Properties {
    [name: string]: {
        value: string,
        type: PrimitiveTypes
    } | TypedInput
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
export {default as TypedInput} from './utils/typedInput.ts'