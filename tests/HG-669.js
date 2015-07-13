module.exports = function(webdriverio, options, callback){
    // TEST HERE
    var passed = false,
        message = '',
        errorhandling = require('../lib/errorhandling');
    try {
        webdriverio
            .remote(options)
            .init()
            .url('http://muppet.wikia.com/wiki/Muppet_caps_(New_Era)?useskin=mercury&noexternals=1')
            .click('.pencil', function(error, returned) { message = error.stack); })
            .waitForExist('.arrow-left', 1000)
            .click('.arrow-left')
            .pause(250)
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
                        'title': 'HG-669',
                        'passed': passed,
                        'message': __dirname
                    });
                });
    } catch (error) {
        errorhandling.handleError(callback, title || __dirname, error.stack);
    }
};
