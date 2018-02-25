var MapField = /** @class */ (function () {
    function MapField(x, y, color, value, message, link, pixmap) {
        this.x = x;
        this.y = y;
        this.pixmap = pixmap;
        this.color = color;
        this.value = value;
        this.message = message;
        this.link = link;
        // this.linkRef = linkref;
    }
    MapField.prototype.getDivElement = function () {
        var self = this;
        var delayedFuncton;
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
    };
    return MapField;
}());
//# sourceMappingURL=MapField.js.map