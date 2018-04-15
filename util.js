"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function logError(error) {
    console.error(new Date().toLocaleString() + " : " + error);
}
exports.logError = logError;
function log(message) {
    console.log(new Date().toLocaleString() + " : " + message);
}
exports.log = log;
function newGuid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + "4" + s4().substring(1) + '-' +
        "8" + s4().substring(1) + '-' + s4() + s4() + s4();
}
exports.newGuid = newGuid;
function isGuid(guid) {
    let reg = new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$");
    return reg.test(guid);
}
exports.isGuid = isGuid;
function pad(value, length, padchar) {
    return (value.toString().length < length) ? pad(padchar + value, length, padchar) : value;
}
exports.pad = pad;
function numberToTrytes(input) {
    const TRYTE_VALUES = "9ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let trytes = "";
    let remainder;
    let quotient = input;
    let digit = "";
    while (quotient != 0) {
        remainder = quotient % 27;
        digit = TRYTE_VALUES.charAt(remainder);
        trytes = digit + trytes;
        quotient = Math.floor(quotient / 27);
    }
    return trytes;
}
exports.numberToTrytes = numberToTrytes;
function trytesToNumber(input) {
    const TRYTE_VALUES = "9ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = 0;
    let position = 0;
    for (let i = input.length - 1; i >= 0; i--) {
        result += TRYTE_VALUES.indexOf(input[i]) * Math.pow(27, position);
        position++;
    }
    return result;
}
exports.trytesToNumber = trytesToNumber;
//# sourceMappingURL=util.js.map