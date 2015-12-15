function get(callback) {
    http.get({
        url: './status.json.gz',
        onload: function() {
            callback(JSON.parse(this.responseText));
        }
    });
}

function display(data) {
    console.log(data);

    var last = data[data.length - 1];
    $('#status').innerHTML = last.up ? 'Everything\'s good!' : 'Uh oh, something\'s gone wrong.';

    var dots = '';
    for (var i = data.length; i > 0; i--) {
        dots += '<div class="dot" data-up="' + data[i - 1].up.toString() + '"></div>';
    }
    $('#dots').innerHTML = dots;
}

get(display);