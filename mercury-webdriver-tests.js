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
    testingStarted = false,
    output = [];

startServer();
waitFor(serverReady, 'Server Started.\n', 'waiting...', startTests, 100);
waitFor(testsDone, 'Tests Complete.\n', null, function() { killServer(); finish(); }, 1000)

//Start the selenium server
function startServer() {
    console.log('=== Starting Selenium Server ===');
    exec('java -jar selenium-server-standalone-2.45.0.jar', {silent:true}, function(status, output){});
}

// Returns true if the Selenium server is ready
function serverReady() {
    return exec('netstat -anp tcp | awk \'$6 == "LISTEN" && $4 ~ "\.4444"\'', {silent:true}).output;
}

// when condition is true, execute callback
function waitFor(condition, successMessage, waitMessage, callback, time) {
    if (condition()) {
        if (successMessage) {
            console.log(successMessage);
        }
        callback();
    } else {
        if (waitMessage) {
            console.log(waitMessage);
        }
        setTimeout(function(){ waitFor(condition, successMessage, waitMessage, callback, time); }, time);
    }
}

// Start the tests. They run asynchronously
function startTests() {
    console.log('=== Running Tests ===');
    cd('tests');
    ls('*.js').forEach(function(file) {
        console.log('Starting ' + file)
        currentTests++;
        totalTests++;
        require('./tests/'+file)(webdriverio, options, testCallback);
    });
    cd('..');
    testingStarted = true;
}

function testCallback(result) {
    currentTests--;
    if (result['passed']) {
        passedTests++;
    }

    output.push(result.title + ': ' + (result.passed ? 'PASSED' : 'FAILED') + (result.message ? '\n\t' + result.message : ''));
}

// are all the tests done?
function testsDone() {
    return currentTests === 0 && testingStarted;
}

// stop the selenium server
function killServer() {
    console.log("=== Stopping Server ===\n");
    exec('kill \"$(ps aux | grep \'selenium-server-standalone\' | grep -v \'grep\' | head -n 1 | awk \'{print $2}\')\"');
}

//Do stuff with the data we gathered
function finish() {
    console.log('=== Test Results ===');
    console.log('Out of ' + totalTests + ' tests, ' + passedTests + ' passed.\n');

    for (var i = 0; i < output.length; i++) {
        console.log(output[i]+'\n');
    }
}
