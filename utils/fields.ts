import { PropertyObject, TypedMetadata } from "../src/Symbol.d.ts";
import TypedInput from "./typedInput.ts";
import Symbol from "../src/Symbol.ts";

abstract class Fields {
    abstract evaluateField(symbol: Symbol, msg: Record<string, unknown>): PropertyObject;
    abstract generateSchema(propertyName: string, field: PropertyObject | TypedInput ):TypedMetadata; 
}

export default Fields