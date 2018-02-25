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
    var reg = new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$");
    return reg.test(guid);
}
exports.isGuid = isGuid;
//# sourceMappingURL=util.js.map