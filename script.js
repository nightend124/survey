const sheetID = '1xRIar17xxjPFhcP2LzQstUwHUdEqBZZqi82f1NELU1U';
const sheetName = 'Questions';
const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

fetch(url)
    .then(res => res.text())
    .then(text => {
        const jsonData = JSON.parse(text.substring(47).slice(0, -2));
        const rows = jsonData.table.rows;
        const form = document.getElementById('survey-form');

        rows.forEach(row => {
            const qId = row.c[0]?.v;
            const question = row.c[1]?.v;
            const options = [row.c[2]?.v, row.c[3]?.v, row.c[4]?.v, row.c[5]?.v].filter(Boolean);

            const fieldset = document.createElement('fieldset');
            fieldset.innerHTML = `<legend>${question}</legend>`;

            options.forEach(opt => {
                const label = document.createElement('label');
                label.innerHTML = `
                    <input type="radio" name="${qId}" value="${opt}" required> ${opt}
                `;
                fieldset.appendChild(label);
            });

            form.appendChild(fieldset);
        });
    })
    .catch(err => console.error(err));

document.getElementById('submit-btn').addEventListener('click', () => {
    const form = document.getElementById('survey-form');
    const questions = form.querySelectorAll('fieldset');
    
    questions.forEach(fieldset => {
        const qId = fieldset.querySelector('input').name;
        const selected = fieldset.querySelector('input:checked');
        if (selected) {
            submitResponse(qId, selected.value);
        }
    });

    alert('Thanks for your feedback!');
});

function submitResponse(questionId, response) {
    fetch('https://script.google.com/macros/s/AKfycbwnRsamkGU9RQxyv2zqYkKAlzd72lV1PlMfW_MNXkQ3YFvQTbCX0ga-X0ZYcNgB_bpj/exec', {
        method: 'POST',
        body: JSON.stringify({ questionId, response }),
        headers: { 'Content-Type': 'application/json' },
    })
    .catch(err => console.error('Error submitting:', err));
}
