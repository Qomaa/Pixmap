class MapField {
    constructor(x: string, y: string, color: string, value: number, pixmap: Pixmap, linkref: string, messageRef: string) {
        this.x = x;
        this.y = y;
        this.pixmap = pixmap;
        this.color = color;
        this.value = value;
        this.linkRef = linkref;
        this.messageRef = messageRef;
    }

    getDivElement(): HTMLDivElement {
        let self = this;
        let delayedFuncton;

        this.divElement = document.createElement("div");
        this.divElement.className = "mapfield";
        this.divElement.id = "x" + this.x + "y" + this.y;

        this.divElement.style.setProperty('--mapFieldColor', this.color);

        // this.divElement.addEventListener("mouseenter", function showDelayedTooltip(e) {
        //     delayedFuncton = setTimeout(() => {
        //         let tooltip = document.createElement("div");
        //         let posval = document.createElement("p");
        //         let link = document.createElement("p");
        //         let mes = document.createElement("textarea");

        //         tooltip.id = "tooltip";
        //         posval.id = "tooltipPosval";
        //         link.id = "tooltipLink";
        //         mes.id = "tooltipMessage";
        //         mes.readOnly = true;
        //         mes.wrap = "soft";
        //         mes.style.display = "none";

        //         posval.textContent = "X:" + (trytesToNumber(self.x) + 1) + " Y:" + (trytesToNumber(self.y) + 1) + " Value: " + self.value + "i";
        //         self.loadMessage((message: string) => {
        //             if (message == "") {
        //                 tooltip.style.setProperty("--tooltipMessageHeight", "0px");
        //                 return;
        //             }
        //             mes.style.display = "block";
        //             tooltip.style.setProperty("--tooltipMessageHeight", "80px");
        //             mes.textContent = message;
        //         });
        //         self.loadLink((lin: string) => {
        //             if (lin == "") {
        //                 tooltip.style.setProperty("--tooltipLinkHeight", "0px");
        //                 return;
        //             }
        //             tooltip.style.setProperty("--tooltipLinkHeight", "20px");
        //             link.textContent = lin;
        //         });

        //         tooltip.appendChild(posval);
        //         tooltip.appendChild(link);
        //         tooltip.appendChild(mes);
        //         self.divElement.appendChild(tooltip);
        //     }, 500);
        // });
        // this.divElement.addEventListener("mouseleave", function (e) {
        //     clearTimeout(delayedFuncton);
        //     while (self.divElement.firstChild) {
        //         self.divElement.removeChild(self.divElement.firstChild);
        //     }
        // });

        return this.divElement;
    }

    loadMessage(callback: (message: string) => void) {
        if (this.messageRef == undefined){
            callback("");
            return;
        } 

        let self = this;
        let xhttp: XMLHttpRequest = new XMLHttpRequest();

        xhttp.open("GET", "/loadMessage?messageRef=" + this.messageRef + "&x=" + this.x + "&y=" + this.y, true);
        xhttp.setRequestHeader("Content-Type", "text/html; charset=utf-8")
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState !== XMLHttpRequest.DONE || xhttp.status !== 200) return;
            callback(xhttp.responseText);
        }
        xhttp.send();
    }

    loadLink(callback: (link: string) => void) {
        if (this.linkRef == undefined) {
            callback("");
            return;
        }

        let self = this;
        let xhttp: XMLHttpRequest = new XMLHttpRequest();

        xhttp.open("GET", "/loadLink?linkRef=" + this.linkRef + "&x=" + this.x + "&y=" + this.y, true);
        xhttp.setRequestHeader("Content-Type", "text/html; charset=utf-8")
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState !== XMLHttpRequest.DONE || xhttp.status !== 200) return;
            callback(xhttp.responseText);
        }
        xhttp.send();
    }

    private divElement: HTMLDivElement;
    pixmap: Pixmap;
    x: string;
    y: string;
    color: string;
    value: number;
    linkRef: string;
    messageRef: string;
}
