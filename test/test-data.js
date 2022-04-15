
//global variable, for html page, refer tpsvr @ npm.
var browserify_import_to_require = require("../browserify-import-to-require.js");
var browserify_transform_tools = require('browserify-transform-tools');
var fs = require("fs");

module.exports = {

	"default": function (done) {
		if (typeof window !== "undefined") throw "disable for browser";

		var fn = __dirname + "/sample/sample.js";
		var txt = fs.readFileSync(fn);

		browserify_transform_tools.runTransform(browserify_import_to_require, fn,
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

		var fn = __dirname + "/sample/sample.js";
		var txt = fs.readFileSync(fn);

		browserify_transform_tools.runTransform(browserify_import_to_require, fn,
			{ content: txt, config: { debugMatch: true, sourceComment: true } },
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
