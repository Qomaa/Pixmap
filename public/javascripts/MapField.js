var MapField = /** @class */ (function () {
    function MapField(x, y, color, value, pixmap, linkref, messageRef) {
        this.x = x;
        this.y = y;
        this.pixmap = pixmap;
        this.color = color;
        this.value = value;
        this.linkRef = linkref;
        this.messageRef = messageRef;
    }
    MapField.prototype.getDivElement = function () {
        var self = this;
        var delayedFuncton;
        this.divElement = document.createElement("div");
        this.divElement.className = "mapfield";
        this.divElement.id = "x" + this.x + "y" + this.y;
        this.divElement.style.setProperty('--mapFieldColor', this.color);
        this.divElement.addEventListener("mouseenter", function showDelayedTooltip(e) {
            delayedFuncton = setTimeout(function () {
                var tooltip = document.createElement("div");
                var posval = document.createElement("p");
                var link = document.createElement("p");
                var mes = document.createElement("textarea");
                tooltip.id = "tooltip";
                posval.id = "tooltipPosval";
                link.id = "tooltipLink";
                mes.id = "tooltipMessage";
                mes.readOnly = true;
                mes.wrap = "soft";
                mes.style.display = "none";
                posval.textContent = "X:" + (trytesToNumber(self.x) + 1) + " Y:" + (trytesToNumber(self.y) + 1) + " Value: " + self.value + "i";
                self.loadMessage(function (message) {
                    if (message == "") {
                        tooltip.style.setProperty("--tooltipMessageHeight", "0px");
                        return;
                    }
                    mes.style.display = "block";
                    tooltip.style.setProperty("--tooltipMessageHeight", "80px");
                    mes.textContent = message;
                });
                self.loadLink(function (lin) {
                    if (lin == "") {
                        tooltip.style.setProperty("--tooltipLinkHeight", "0px");
                        return;
                    }
                    tooltip.style.setProperty("--tooltipLinkHeight", "20px");
                    link.textContent = lin;
                });
                tooltip.appendChild(posval);
                tooltip.appendChild(link);
                tooltip.appendChild(mes);
                self.divElement.appendChild(tooltip);
            }, 500);
        });
        this.divElement.addEventListener("mouseleave", function (e) {
            clearTimeout(delayedFuncton);
            while (self.divElement.firstChild) {
                self.divElement.removeChild(self.divElement.firstChild);
            }
        });
        return this.divElement;
    };
    MapField.prototype.loadMessage = function (callback) {
        if (this.messageRef == undefined) {
            callback("");
            return;
        }
        var self = this;
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "/loadMessage?messageRef=" + this.messageRef + "&x=" + this.x + "&y=" + this.y, true);
        xhttp.setRequestHeader("Content-Type", "text/html; charset=utf-8");
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState !== XMLHttpRequest.DONE || xhttp.status !== 200)
                return;
            callback(xhttp.responseText);
        };
        xhttp.send();
    };
    MapField.prototype.loadLink = function (callback) {
        if (this.linkRef == undefined) {
            callback("");
            return;
        }
        var self = this;
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "/loadLink?linkRef=" + this.linkRef + "&x=" + this.x + "&y=" + this.y, true);
        xhttp.setRequestHeader("Content-Type", "text/html; charset=utf-8");
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState !== XMLHttpRequest.DONE || xhttp.status !== 200)
                return;
            callback(xhttp.responseText);
        };
        xhttp.send();
    };
    return MapField;
}());
//# sourceMappingURL=MapField.js.map