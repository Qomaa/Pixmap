window.onload = function () {
    let table: HTMLTableElement = document.querySelector("#table");
    let pixmap = new Pixmap();
    let i = 0;
    
    let loading = document.getElementById("loading");
    loading.style.display = "block";

    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }

    pixmap.load(() => {
        pixmap.mapFields.sort((item1: MapField, item2: MapField): number => {
            if (item1.value < item2.value) return 1;
            if (item1.value > item2.value) return -1;

            let r = Math.round(Math.random());
            if (r == 0) r = -1;
            return r;
        });

        //header
        let row = document.createElement("tr");
        row.insertCell(0).outerHTML ="<th></th>";
        row.insertCell(1).outerHTML ="<th>Value</th>";
        row.insertCell(2).outerHTML ="<th>Link</th>";
        row.insertCell(3).outerHTML ="<th>Message</th>";
        let head= table.createTHead();
        head.appendChild(row);
        
        pixmap.mapFields.forEach(function (mapField: MapField) {
            if (mapField.value < 2) return;
            
            row = document.createElement("tr");
            i++;

            createCell(row, 0, i, "number", false);
            createCell(row, 1, mapField.value + "i", null, false);
            createCell(row, 2, mapField.link, null, true);
            createCell(row, 3, mapField.message, null, false);

            table.appendChild(row);
        });

        loading.style.display = "none";
    });
}

function createCell(row: HTMLTableRowElement, index: number, cellContent, className: string, isLink: boolean) {
    let cell = row.insertCell(index);

    cell.className = className;

    if (cellContent == undefined) {
        cellContent = "";
    }

    if (isLink) {
        let link = document.createElement("a");
        link.href = cellContent;
        link.textContent = cellContent;
        cell.appendChild(link);
    }
    else {
        cell.innerText = cellContent;
    }
}