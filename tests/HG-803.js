module.exports = function(webdriverio, options, callback){
    // TEST HERE
    var passed = false,
        title = 'HG-803',
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
                .url('http://localhost:8000/wiki/Muppet_caps_(New_Era)?file=New_era_kermit_head_cap.jpg&useskin=mercury&noexternals=1')
                .pause(1000)
                .elements('.current')
                .then(function (returned) {
                    if (returned.value.length > 0) {
                        passed = true;
                    } else {
                        passed = false;
                        message = 'Image did not load in lightbox correctly.';
                    }
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
