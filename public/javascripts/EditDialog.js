var EditDialog = /** @class */ (function () {
    function EditDialog() {
        var _this = this;
        this.dialogDiv = document.getElementById("editDialog");
        this.positionSpan = document.getElementById("dialogXY");
        this.XYSpan = document.getElementById("XY");
        this.valueSpan = document.getElementById("dialogValue");
        this.transferIotaInput = document.getElementById("transferIota");
        this.transferAddressInput = document.getElementById("transferAddress");
        this.transferTagInput = document.getElementById("transferTag");
        this.transferAddressInput.addEventListener("click", function (e) { return _this.transferAddressInput.select(); });
        this.transferTagInput.addEventListener("click", function (e) { return _this.transferTagInput.select(); });
        this.transferIotaInput.addEventListener("click", function (e) {
            _this.transferIotaInput.selectionStart = 0;
            _this.transferIotaInput.selectionEnd = _this.transferIotaInput.value.length - 1;
        });
    }
    EditDialog.prototype.show = function (mapField) {
        var _this = this;
        this.valueSpan.textContent = mapField.value.toString() + "i";
        this.positionSpan.textContent = "X: " + (mapField.x + 1) + "  Y: " + (mapField.y + 1);
        this.XYSpan.textContent = " " + this.positionSpan.textContent;
        this.colorButton = document.getElementById("dialogColor");
        this.colorButton.jscolor.onFineChange = function () {
            _this.colorHex = _this.colorButton.jscolor.toHEXString();
            _this.updateTag(mapField);
        };
        this.colorButton.jscolor.fromString(mapField.color);
        this.colorHex = this.colorButton.jscolor.toHEXString();
        this.transferIotaInput.value = (mapField.value + 1).toString() + "i";
        this.transferAddressInput.value = RECEIVE_ADDRESS;
        this.updateTag(mapField);
        this.dialogDiv.style.display = "block";
    };
    EditDialog.prototype.hide = function () {
        this.dialogDiv.style.display = "none";
    };
    EditDialog.prototype.updateTag = function (mapField) {
        var ascii;
        var tag;
        ascii = pad(mapField.x.toString(), 2, "0") +
            pad(mapField.y.toString(), 2, "0") +
            this.colorHex;
        tag = toTrytes(ascii);
        this.transferTagInput.value = tag;
    };
    return EditDialog;
}());
//# sourceMappingURL=EditDialog.js.map