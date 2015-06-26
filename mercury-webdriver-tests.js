var webdriverio = require('webdriverio');
require('shelljs/global');

var options = {
    desiredCapabilities: {
        browserName: 'chrome'
    }
};

var currentTests = 0,
    totalTests = 0,
    passedTests = 0,
    testingStarted = false;

startServer();
waitFor(serverReady, "Server started.\n", "waiting...", startTests, 100);
waitFor(testsDone, "Tests complete.\n", null, function() { killServer(); finish(); }, 1000)

//Start the selenium
function startServer(){
    console.log('Starting Selenium server...');
    exec('java -jar selenium-server-standalone-2.45.0.jar', {silent:true}, function(status, output){});
}

// Returns true if the Selenium server is ready
function serverReady(){
    return exec('netstat -anp tcp | awk \'$6 == "LISTEN" && $4 ~ "\.4444"\'', {silent:true}).output;
}

// when condition is true, execute callback
function waitFor(condition, successMessage, waitMessage, callback, time) {
    if (condition()){
        if (successMessage) {
            console.log(successMessage);
        }
        callback();
    }else{
        if (waitMessage) {
            console.log(waitMessage);
        }
        setTimeout(function(){ waitFor(condition, successMessage, waitMessage, callback, time); }, time);
    }
}

// Start the tests. They run asynchronously
function startTests() {
    console.log('Running tests...');

    cd('tests');
    ls('*.js').forEach(function(file) {
        console.log('\tStarting ' + file)
        currentTests++;
        totalTests++;
        require('./tests/'+file)(webdriverio, options, testCallback);
    });
    cd('..');

    console.log('Output:');
    testingStarted = true;
}

function testCallback(passed) {
    currentTests--;

    if (passed) {
        passedTests++;
    }
}

// are all the tests done?
function testsDone() {
    return currentTests === 0 && testingStarted;
}

// stop the selenium server
function killServer() {
    // this must be terrible practice
    console.log("Stopping server.\n");
    exec('kill \"$(ps aux | grep \'selenium\' | grep -v \'grep\' | head -n 1 | awk \'{print $2}\')\"');
}

function finish() {
    console.log('Out of ' + totalTests + ' tests, ' + passedTests + ' passed.');
}
