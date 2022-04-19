
//browserify-import-to-require @ npm, a browserify transform, transfering static import statement to require statement.

var browserify_transform_tools = require('browserify-transform-tools');
var static_import_to_require = require('static-import-to-require');

//var debugFlag = 1;

module.exports = browserify_transform_tools.makeStringTransform(
	"import-to-require", { jsFilesOnly: true },
	function (content, transformOptions, done) {
		/*
		if (debugFlag) {
			console.log(transformOptions);
			console.log(transformOptions.config);
			console.log(transformOptions.configData);
			debugFlag = 0;
		}
		*/

		var s = static_import_to_require(content, transformOptions.config);
		if (s && s !== content) {
			content = s;
			if (transformOptions.config && transformOptions.config.debugInfo)
				console.log("transfered import: " + transformOptions.file);
		}

		done(null, content);
	}
);
