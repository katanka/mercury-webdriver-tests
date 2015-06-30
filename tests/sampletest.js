module.exports = function(webdriverio, options, callback){
    // TEST HERE
    var passed = false,
        output = 'Sample Test:\n';
    webdriverio
        .remote(options)
        .init()
        .url('http://starwars.wikia.com/wiki/Han_Solo')
        .title(function(err, res) {
            output += '\tTitle was: ' + res.value;
            passed = true;
        })
        .end()
        .then(function(){ callback(passed, output) });


};
