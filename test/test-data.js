
//global variable, for html page, refer tpsvr @ npm.
var browserify_import_to_require = require("../browserify-import-to-require.js");
var browserify_transform_tools = require('browserify-transform-tools');
var fs = require("fs");

var sampleFile = __dirname + "/../node_modules/static-import-to-require/test/sample/sample.js";

module.exports = {

	"default": function (done) {
		if (typeof window !== "undefined") throw "disable for browser";

		var txt = fs.readFileSync(sampleFile);
		//var txt = fs.readFileSync(__dirname+"/../package.json");

		browserify_transform_tools.runTransform(browserify_import_to_require, sampleFile,
			{ content: txt },
			function (err, transformed) {
				if (err) {
					console.log(err);
					return;
				}
				console.log("----------------");
				console.log(transformed);
			}
		);

		done(false);
	},

	"sourceComment": function (done) {
		if (typeof window !== "undefined") throw "disable for browser";

		var txt = fs.readFileSync(sampleFile);

		browserify_transform_tools.runTransform(browserify_import_to_require, sampleFile,
			{ content: txt, config: { debugInfo: true, sourceComment: true } },
			function (err, transformed) {
				if (err) {
					console.log(err);
					return;
				}
				console.log("----------------");
				console.log(transformed);
			}
		);

		done(false);
	},

};

// for html page
//if (typeof setHtmlPage === "function") setHtmlPage("title", "10em", 1);	//page setting
if (typeof showResult !== "function") showResult = function (text) { console.log(text); }

//for mocha
if (typeof describe === "function") describe('browserify_import_to_require', function () { for (var i in module.exports) { it(i, module.exports[i]).timeout(5000); } });
