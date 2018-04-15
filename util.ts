export function logError(error) {
    console.error(new Date().toLocaleString() + " : " + error);
}

export function log(message: any){
    console.log(new Date().toLocaleString() + " : " + message);
}

export function newGuid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + "4" + s4().substring(1) + '-' +
        "8" + s4().substring(1) + '-' + s4() + s4() + s4();
}

export function isGuid(guid: string): boolean {
    let reg = new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$");
    return reg.test(guid);
}

export function pad(value: string, length: number, padchar: string) {
    return (value.toString().length < length) ? pad(padchar + value, length, padchar) : value;
}

export function numberToTrytes(input: number): string {
    const TRYTE_VALUES = "9ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let trytes: string = "";
    let remainder: number;
    let quotient = input;

    let digit: string = "";

    while (quotient != 0) {

        remainder = quotient % 27;
        digit = TRYTE_VALUES.charAt(remainder);
        trytes = digit + trytes;
        quotient = Math.floor(quotient / 27);
    }

    return trytes;
}

export function trytesToNumber(input: string): number {
    const TRYTE_VALUES = "9ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result: number = 0;
    let position: number = 0;

    for (let i = input.length - 1; i >= 0; i--) {
        result += TRYTE_VALUES.indexOf(input[i]) * Math.pow(27, position);
        position++;
    }

    return result;
}