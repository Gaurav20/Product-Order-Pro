// script.js
document.addEventListener('DOMContentLoaded', function() {
    const maxRows = 8;
    let rowCount = 1;
    const apiKey = 'd780f14b3b5c4009aae891b4f3f0b481'; // Replace with your actual API key

    const grid1 = document.getElementById('product-table').querySelector('tbody');
    const showOrderBtn = document.getElementById('show-order-btn');
    const readOrderBtn = document.getElementById('read-order-btn');
    const grid2 = document.getElementById('grid2');

    grid1.addEventListener('click', function(event) {
        if (event.target.classList.contains('add-btn')) {
            const row = event.target.closest('tr');
            const product = row.querySelector('.product-name').value;
            const quantity = row.querySelector('.product-quantity').value;

            if (product && quantity) {
                if (rowCount < maxRows) {
                    addRow();
                }
                event.target.disabled = true;
            } else {
                alert('Please choose both product and quantity.');
            }
        }
    });

    showOrderBtn.addEventListener('click', function() {
        showOrder();
    });

    readOrderBtn.addEventListener('click', function() {
        readOrder();
    });

    function addRow() {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>
                <select class="product-name">
                    <option value="" disabled selected>Choose Product</option>
                    <option value="Pencil">Pencil</option>
                    <option value="Eraser">Eraser</option>
                    <option value="Pens">Pens</option>
                </select>
            </td>
            <td>
                <select class="product-quantity">
                    <option value="" disabled selected>Choose Quantity</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
            </td>
            <td><button class="add-btn">ADD</button></td>
        `;
        grid1.appendChild(newRow);
        rowCount++;
    }

    function showOrder() {
        const rows = grid1.querySelectorAll('tr');
        grid2.innerHTML = '';
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = '<th>Product Name</th><th>Quantity</th>';
        thead.appendChild(headerRow);
        table.appendChild(thead);

        rows.forEach(row => {
            const product = row.querySelector('.product-name').value;
            const quantity = row.querySelector('.product-quantity').value;
            if (product && quantity) {
                const dataRow = document.createElement('tr');
                dataRow.innerHTML = `<td>${product}</td><td>${quantity}</td>`;
                tbody.appendChild(dataRow);
            }
        });

        table.appendChild(tbody);
        grid2.appendChild(table);
    }

    function readOrder() {
        const orderText = Array.from(grid2.querySelectorAll('tbody tr')).map(row => {
            const cells = row.querySelectorAll('td');
            return `${cells[0].textContent}: ${cells[1].textContent}`;
        }).join(', ');

        if (orderText) {
            const xhr = new XMLHttpRequest();
            const url = `https://api.voicerss.org/?key=${apiKey}&hl=en-us&src=${encodeURIComponent(orderText)}`;

            xhr.open('GET', url, true);
            xhr.responseType = 'blob';

            xhr.onload = function() {
                if (xhr.status === 200) {
                    const audio = new Audio(URL.createObjectURL(xhr.response));
                    audio.play();
                } else {
                    console.error('Error:', xhr.statusText);
                }
            };

            xhr.onerror = function() {
                console.error('Network Error');
            };

            xhr.send();
        } else {
            alert('No order to read.');
        }
    }
});
