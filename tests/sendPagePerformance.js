module.exports = function(webdriverio, options, callback){
	var passed = false,
		title = 'sendPagePerformance',
		message = '',
		domain = require('domain').create();

	domain.on('error', function(error) {
		passed = false;
		message = error.stack;
	});

	domain.add(webdriverio);

	domain.run(function () {
		try {
			var client = webdriverio.remote(options);

			client
				.init()
				// todo: make this configurable
				.url('http://ja.destiny.wikia.com/wiki/Destiny?useskin=mercury&buckysampling=100&noexternals=1')
				.waitUntil(function() {
					return this.execute(function() {
						return window.readyState === 'complete';
					}).then(function(res) {
						return res.value;
					});
				})
				.pause(200)
				.execute(function () {
					return M.prop('pagePerformanceSent')
				})
				.then(function (returned) {
					passed = returned.value === true;
					if (!passed) {
						message = 'Page performance stats not sent';
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
