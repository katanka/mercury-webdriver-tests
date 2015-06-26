var webdriverio = require('webdriverio');

var options = {
    desiredCapabilities: {
        browserName: 'chrome'
    }
};

webdriverio
    .remote(options)
    .init()
    .url('http://starwars.wikia.com/wiki/Han_Solo')
    .title(function(err, res) {
        console.log('Title was: ' + res.value);
    })
    .end();
