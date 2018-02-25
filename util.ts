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