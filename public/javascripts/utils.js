function rgb2hex(rgb) {
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
}
function pad(value, length, padchar) {
    return (value.toString().length < length) ? pad(padchar + value, length, padchar) : value;
}
function numberToTrytes(input) {
    var TRYTE_VALUES = "9ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var trytes = "";
    var remainder;
    var quotient = input;
    var digit = "";
    while (quotient != 0) {
        remainder = quotient % 27;
        digit = TRYTE_VALUES.charAt(remainder);
        trytes = digit + trytes;
        quotient = Math.floor(quotient / 27);
    }
    return trytes;
}
function trytesToNumber(input) {
    var TRYTE_VALUES = "9ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var result = 0;
    var position = 0;
    for (var i = input.length - 1; i >= 0; i--) {
        result += TRYTE_VALUES.indexOf(input[i]) * Math.pow(27, position);
        position++;
    }
    return result;
}
function toTrytes(input) {
    var TRYTE_VALUES = "9ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var trytes = "";
    for (var i = 0; i < input.length; i++) {
        var char = input[i];
        var asciiValue = char.charCodeAt(0);
        if (asciiValue > 255) {
            return null;
        } // If not recognizable ASCII character, return null
        var firstValue = asciiValue % 27;
        var secondValue = (asciiValue - firstValue) / 27;
        var trytesValue = TRYTE_VALUES[firstValue] + TRYTE_VALUES[secondValue];
        trytes += trytesValue;
    }
    return trytes;
}
function fromTrytes(inputTrytes) {
    // If input length is odd, return null
    if (inputTrytes.length % 2)
        return null;
    var TRYTE_VALUES = "9ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var outputString = "";
    for (var i = 0; i < inputTrytes.length; i += 2) {
        // get a trytes pair
        var trytes = inputTrytes[i] + inputTrytes[i + 1];
        var firstValue = TRYTE_VALUES.indexOf(trytes[0]);
        var secondValue = TRYTE_VALUES.indexOf(trytes[1]);
        var decimalValue = firstValue + secondValue * 27;
        var character = String.fromCharCode(decimalValue);
        outputString += character;
    }
    return outputString;
}
//# sourceMappingURL=utils.js.map