import type { Schema, OnMessageCallback } from "./Symbol.d.ts";
abstract class SymbolBase {
    abstract type: string;
    abstract isConfig: boolean;
    abstract category: string;
    abstract schema: Schema;
    abstract description: string;

    abstract onInit(_callback: OnMessageCallback): Promise<void>;
    abstract onMessage(_msg: Record<string, any>, _vals: Record<string, any>, _callback: OnMessageCallback): Promise<void>
}

export default SymbolBase;