const sheetID = '1hCIqkod6LDRs8pzpcXTUU6w7MhRJ8bcmY_QlECySOSU';
const sheetName = 'Sheet1';
const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

let tableData = [];
let headers = [];

fetch(url)
    .then(res => res.text())
    .then(text => {
        const jsonData = JSON.parse(text.substring(47).slice(0, -2));
        const rows = jsonData.table.rows;

        headers = rows[0].c.map(cell => cell?.v || '');
        tableData = rows.slice(1).map(row => row.c.map(cell => cell?.v || ''));

        renderTable(tableData);

        document.getElementById('searchInput').addEventListener('input', function () {
            const searchValue = this.value.toLowerCase();
            const filteredData = tableData.filter(row =>
                row.some(cell => cell.toLowerCase().includes(searchValue))
            );
            renderTable(filteredData);
        });
    })
    .catch(err => console.error('Error loading sheet data:', err));

function renderTable(data) {
    let html = '<table><thead><tr>';
    headers.forEach((header, index) => {
        html += `<th onclick="sortTable(${index})">${header} &#x25B2;&#x25BC;</th>`;
    });
    html += '</tr></thead><tbody>';
    data.forEach(row => {
        html += '<tr>';
        row.forEach(cell => {
            html += `<td>${cell}</td>`;
        });
        html += '</tr>';
    });
    html += '</tbody></table>';

    document.getElementById('sheet-data').innerHTML = html;
}

function sortTable(colIndex) {
    let sortedData = [...tableData];
    const isNumberColumn = sortedData.every(row => !isNaN(row[colIndex]) && row[colIndex] !== '');

    sortedData.sort((a, b) => {
        const valA = a[colIndex];
        const valB = b[colIndex];
        if (isNumberColumn) {
            return parseFloat(valA) - parseFloat(valB);
        }
        return valA.localeCompare(valB);
    });

    tableData = sortedData;
    renderTable(tableData);
}
