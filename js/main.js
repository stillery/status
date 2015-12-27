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
    console.log(data);

    var last = data[0];
    $('#status').innerHTML = last.up ? 'Everything\'s good!' : 'Uh oh, something\'s gone wrong.';

    var dots = '<div class="marker">Now</div>';
    for (var i = 0; i < data.length; i++) {
        if (i > 36) {
            var exp = Math.log(i / 36) / Math.log(2);
            if (Math.floor(exp) === exp) {
                var hours = i / 12;
                var text;
                if (hours < 24) {
                    text = hours + ' hours ago';
                } else if (hours === 24) {
                    text = 'A day ago';
                } else {
                    text = hours / 24 + ' days ago';
                }
                dots += '<div class="marker">' + text + '</div>';
            }
        }

        dots += '<div class="dot" data-up="' + data[i].up.toString() + '"></div>';
    }
    $('#dots').innerHTML = dots;
}

get(display);