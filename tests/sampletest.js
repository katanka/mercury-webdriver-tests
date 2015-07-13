module.exports = function(webdriverio, options, callback){
    // TEST HERE
    var passed = false,
        title = 'Sample Test',
        message = '',
        domain = require('domain').create();

    domain.on('error', function(error) {
        passed = false;
        message = error.stack;
    });

    domain.add(webdriverio);

    domain.run(function () {
        try {
            webdriverio
                .remote(options)
                .init()
                .url('http://starwars.wikia.com/wiki/Han_Solo')
                .title(function (err, returned) {
                    message = 'Title was: ' + returned.value;
                    passed = true;
                })
                .end()
                .then(function () {
                        callback({
                            'title': title,
                            'passed': passed,
                            'message': message
                        });
                    });
        } catch (error) {
            // do nothing
        }
    });

};
