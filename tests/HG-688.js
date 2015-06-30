module.exports = function(webdriverio, options, callback){
    // TEST HERE
    var passed = false,
        output = 'HG-688:\n';

    webdriverio
        .remote(options)
        .init()
        .url('http://sandbox-mercury.ja.destiny.wikia.com/wiki/Destiny?useskin=mercury&noexternals=1')
        .click('.pencil')
        .waitForExist('.arrow-left', 1000)
        .click('.arrow-left')
        .pause(250)
        // if .InfoboxImage contains a figure, it has be re-rendered. if not, there was an error
        .selectorExecute('.InfoboxImage', function(elements){ return elements[0].innerHTML.startsWith('<figure'); }, 5)
        .then(function(returned) {
            passed = returned;
            if (!passed) {
                output += '\tInfobox image was not rendered.';
            }
        })
        .end()
        .then(function(){
                callback(passed, output);
            });
};
