let urlRegEx = new RegExp(/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i);
function getUrlRegEx() {
    return urlRegEx;
}
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
function trimEnd(value, trimChar) {
    while (value.charAt(value.length - 1) == trimChar) {
        value = value.substr(0, value.length - 1);
    }
    return value;
}
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
function hideElement(element) {
    element.style.display = "none";
}
function showElement(element) {
    element.style.display = "block";
}
//# sourceMappingURL=utils.js.map