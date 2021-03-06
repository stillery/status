const SIZE = 4;

function get(callback) {
    http.get({
        url: './status.json.gz',
        onload: function() {
            callback(JSON.parse(this.responseText));
        }
    });
}

function display(data) {
    data = data.reverse();
    console.log(data.length);

    document.getElementById('status').textContent = data[0] ? 'ok' : 'down';
    document.getElementById('status').classList.add(data[0] ? 'ok' : 'down');

    const rows = Math.ceil(data.length / 288);

    const grid = document.getElementById('grid');
    const ctx = grid.getContext('2d');

    grid.width = 288 * SIZE;
    grid.height = rows * SIZE;

    for (let i = 0; i < data.length; i++) {
        const row = i / 288 | 0;
        const col = i % 288;

        ctx.fillStyle = data[i] ? '#A4E986' : '#EC6676';
        ctx.fillRect(col * SIZE, row * SIZE, SIZE / 2, SIZE / 2);
    }
}

get(display);