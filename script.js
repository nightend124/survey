const sheetID = '1hCIqkod6LDRs8pzpcXTUU6w7MhRJ8bcmY_QlECySOSU';
const sheetName = 'Sheet1';
const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

fetch(url)
    .then(res => res.text())
    .then(text => {
        const jsonData = JSON.parse(text.substring(47).slice(0, -2));
        const rows = jsonData.table.rows;

        let html = '<table>';
        rows.forEach(row => {
            html += '<tr>';
            row.c.forEach(cell => {
                html += `<td>${cell?.v || ''}</td>`;
            });
            html += '</tr>';
        });
        html += '</table>';

        document.getElementById('sheet-data').innerHTML = html;
    })
    .catch(err => console.error('Error loading sheet data:', err));
