var EditDialog = /** @class */ (function () {
    function EditDialog(mapField) {
        var _this = this;
        this.mapField = mapField;
        this.closeSpan = document.getElementById("dialogClose");
        this.closeSpan.addEventListener("click", function (e) { return _this.hide(); });
        this.dialogDiv = document.getElementById("editDialog");
        this.positionSpan = document.getElementById("dialogXY");
        this.valueSpan = document.getElementById("dialogValue");
        this.transferIotaSpan = document.getElementById("transferIota");
        this.transferAddressSpan = document.getElementById("transferAddress");
        this.transferTagSpan = document.getElementById("transferTag");
    }
    EditDialog.prototype.show = function () {
        this.dialogDiv.style.display = "block";
        this.valueSpan.textContent = this.mapField.value.toString();
        this.positionSpan.textContent = "X: " + (this.mapField.x + 1) + "  Y: " + (this.mapField.y + 1);
        this.updateInstruction();
        var colVal = document.getElementById("dialogColorValue");
        // colVal.jscolor.fromString(this.mapField.color);
        var b = document.getElementById("dialogColor");
        b.jscolor.fromString(this.mapField.color);
        // b.style.backgroundColor = this.mapField.color;
        // colVal.onsubmit = function(){
        //     console.log("1");
        // };
        // var ev = document.createEvent('Event');
        // ev.initEvent('keypress',false, false);
        // ev.which = ev.keyCode = 13;
        // colVal.dispatchEvent(ev);
        // let but = document.getElementById("dialogColor") as HTMLButtonElement;
        // but.style.backgroundColor = this.mapField.color;
        // console.log(but);
    };
    EditDialog.prototype.hide = function () {
        this.dialogDiv.style.display = "none";
    };
    EditDialog.prototype.updateInstruction = function () {
        this.transferIotaSpan.textContent = (this.mapField.value + 1).toString() + " ";
        this.transferAddressSpan.textContent = RECEIVE_ADDRESS + " ";
        this.transferTagSpan.textContent = this.getTag();
    };
    EditDialog.prototype.getTag = function () {
        var ascii;
        var tag;
        ascii = pad(this.mapField.x.toString(), 2, "0") +
            pad(this.mapField.y.toString(), 2, "0"); //+
        //this.colorHex.substring(1, this.colorHex.length-1);
        return this.toTrytes(ascii);
    };
    EditDialog.prototype.toTrytes = function (input) {
        if (typeof input !== 'string')
            return null;
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
    };
    EditDialog.prototype.fromTrytes = function (inputTrytes) {
        if (typeof inputTrytes !== 'string')
            return null;
        if (inputTrytes.length % 2)
            return null; // If input length is odd, return null
        var TRYTE_VALUES = "9ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var outputString = "";
        for (var i = 0; i < inputTrytes.length; i += 2) {
            var trytes = inputTrytes[i] + inputTrytes[i + 1]; // get a trytes pair
            var firstValue = TRYTE_VALUES.indexOf(trytes[0]);
            var secondValue = TRYTE_VALUES.indexOf(trytes[1]);
            var decimalValue = firstValue + secondValue * 27;
            var character = String.fromCharCode(decimalValue);
            outputString += character;
        }
        return outputString;
    };
    return EditDialog;
}());
//# sourceMappingURL=EditDialog.js.map