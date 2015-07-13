module.exports = function(webdriverio, options, callback){
    // TEST HERE
    var passed = false,
        title = 'HG-669',
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
                .url('http://ja.destiny.wikia.com/wiki/Destiny?useskin=mercury&noexternals=1')
                .waitForExist('.pencil', 1000)
                .click('.pencil')
                .waitForExist('.arrow-left', 1000)
                .click('.arrow-left')
                .pause(500)
                // if .InfoboxImage contains a figure, it has been re-rendered. if not, there was an error
                .selectorExecute('.InfoboxImage', function (elements) { return elements[0].innerHTML.startsWith('<figure'); }, 5)
                .then(function (returned) {
                    passed = returned;
                    if (!passed) {
                        message = 'Infobox image was not rendered.';
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
