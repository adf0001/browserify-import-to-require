
//global variable, for html page, refer tpsvr @ npm.
var browserify_import_to_require = require("../browserify-import-to-require.js");
var browserify_transform_tools = require('browserify-transform-tools');
var fs = require("fs");

module.exports = {

	"browserify_import_to_require": function (done) {
		if (typeof window !== "undefined") throw "disable for browser";

		var fn = __dirname + "/sample/sample.js";
		var txt = fs.readFileSync(fn);

		browserify_transform_tools.runTransform(browserify_import_to_require, fn, txt,
			function (err, transformed) {
				// Verify transformed is what we expect...
				console.log("----------------");
				console.log(err, transformed);
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
