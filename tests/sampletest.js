module.exports = function(webdriverio, options, callback){
    // TEST HERE
    var passed = false,
        message = '';

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
                        'title': 'Sample Test',
                        'passed': passed,
                        'message': message
                    });
                });
    } catch(error) {
        output += error.stack;
        callback(false, output);
    }
};
