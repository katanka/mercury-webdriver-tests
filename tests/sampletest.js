module.exports = function(webdriverio, options, callback){
    // TEST HERE
    var passed = false;
    webdriverio
        .remote(options)
        .init()
        .url('http://starwars.wikia.com/wiki/Han_Solo')
        .title(function(err, res) {
            console.log('Title was: ' + res.value);
            passed = true;
        })
        .end()
        .then(function(){ callback(passed) });


};
