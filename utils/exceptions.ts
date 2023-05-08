class UnmatchedDataTypeException implements Error {
    name: string = "UnmatchedDataTypeException";
    message: string;
    constructor(message: string) {
        this.message = message
    }
}


export default UnmatchedDataTypeException