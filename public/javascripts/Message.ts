class Message {
    constructor(x: string, y: string, num: number, clientID: string, text: string, link: string) {
        this.x = x;
        this.y = y;
        this.num = num;
        this.clientID = clientID;
        this.text = text;
        this.link = link;
    }

    x: string;
    y: string;
    num: number;
    clientID: string;
    text: string;
    link: string;
}