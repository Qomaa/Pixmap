window.onload = function () {
    let table = document.querySelector("#table");
    let pixmap = new Pixmap();
    let i = 0;
    let loading = document.getElementById("loading");
    loading.style.display = "block";
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    pixmap.load(() => {
        pixmap.mapFields.sort((item1, item2) => {
            if (item1.value < item2.value)
                return 1;
            if (item1.value > item2.value)
                return -1;
            let r = Math.round(Math.random());
            if (r == 0)
                r = -1;
            return r;
        });
        //header
        let row = document.createElement("tr");
        row.insertCell(0).outerHTML = "<th></th>";
        row.insertCell(1).outerHTML = "<th>Value</th>";
        row.insertCell(2).outerHTML = "<th>Link</th>";
        row.insertCell(3).outerHTML = "<th>Message</th>";
        row.insertCell(4).outerHTML = "<th>TimeStamp</th>";
        let head = table.createTHead();
        head.appendChild(row);
        pixmap.mapFields.forEach(function (mapField) {
            if (mapField.value < 2)
                return;
            row = document.createElement("tr");
            i++;
            if (mapField.transaction != undefined)
                createCell(row, 0, i, "number", true, "https://thetangle.org/transaction/" + mapField.transaction);
            else
                createCell(row, 0, i, "number", false, null);
            createCell(row, 1, mapField.value + "i", null, false, null);
            createCell(row, 2, mapField.link, null, true, mapField.link);
            createCell(row, 3, mapField.message, null, false, null);
            if (mapField.timestamp != undefined)
                createCell(row, 4, new Date(+mapField.timestamp).toLocaleString(), null, false, null);
            else
                createCell(row, 4, "", null, false, null);
            table.appendChild(row);
        });
        loading.style.display = "none";
    });
};
function createCell(row, index, cellContent, className, isLink, link) {
    let cell = row.insertCell(index);
    cell.className = className;
    if (cellContent == undefined) {
        cellContent = "";
    }
    if (isLink) {
        let lin = document.createElement("a");
        lin.href = link;
        lin.textContent = cellContent;
        cell.appendChild(lin);
    }
    else {
        cell.innerText = cellContent;
    }
}
//# sourceMappingURL=table.js.map