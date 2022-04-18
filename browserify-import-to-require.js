
//browserify-import-to-require @ npm, a browserify transform, transfering static import statement to require statement.

var browserify_transform_tools = require('browserify-transform-tools');
var acorn = require('acorn');

function formatNamedImports(s, spaceName, moduleName) {
	var sn = spaceName || moduleName.slice(1, -1).replace(/\W/g, "_");

	var sa = s.replace(/(^[\s\{,]+|[\s\},]+$)/g, "").split(",");
	var i, imax = sa.length, si, mr, a = [];
	for (i = 0; i < imax; i++) {
		si = sa[i];
		mr = si.match(/^\s*(\w+)(\s+as\s+\w+)?/);
		if (!mr) continue;	//may empty

		if (mr[2]) a[a.length] = mr[2].match(/\w+$/)[0] + "= " + sn + "." + mr[1];	//alias
		else a[a.length] = mr[1] + "= " + sn + "." + mr[1];
	}

	if (!a.length) return "";

	if (spaceName) return a.join(",\n\t");	//spaceName already exists

	if (a.length === 1 && !spaceName) {
		//only 1 item, rebuild single line.
		if (mr[2]) return mr[2].match(/\w+$/)[0] + "= require(" + moduleName + ")." + mr[1];	//alias
		else return mr[1] + "= require(" + moduleName + ")." + mr[1];
	}

	return sn + "= require(" + moduleName + "),\n\t" + a.join(",\n\t");
}

function formatSourceComment(source, sourceComment) {
	if (!sourceComment) return "";
	return "\n//" + source.replace(/[\r\n]+/g, "\\n ") + "\n";
}

var ECMA_VERSION = 99;	//to avoid SyntaxError by dynamic import-calling `import()`, or other future error.

function removeComment(s) {
	var a = [], lastEnd = 0;
	acorn.parse(s, {
		sourceType: 'module', ecmaVersion: ECMA_VERSION,
		onComment: function (block, text, start, end) {
			a.push(s.slice(lastEnd, start));
			lastEnd = end;
		}
	});
	if (!a.length) return s;	//have no comment

	a.push(s.slice(lastEnd));
	return a.join(" ");		//block comment can be a splitter like a space
}

/*
refer https://262.ecma-international.org/11.0/#sec-imports

Syntax
	ImportDeclaration:
		import ImportClause FromClause;
		import ModuleSpecifier;
	ImportClause:
		ImportedDefaultBinding
		NameSpaceImport
		NamedImports
		ImportedDefaultBinding,NameSpaceImport
		ImportedDefaultBinding,NamedImports
*/
function transfer(source, sourceComment) {
	var s = removeComment(source).replace(/^import\s*/, "");	//remove 'import' and the following spaces

	switch (s.charAt(0)) {
		case "*":	//import * as name from "module-name";
			return s.replace(/^\*\s*as\s+(\S+)\s+from\s*([\'\"][^\'\"]+[\'\"])[\s;]*$/,
				function (m, p1, p2) {
					//NameSpaceImport
					return formatSourceComment(source, sourceComment) +
						"var " + p1 + "= require(" + p2 + ");";
				});
		case "{":	//import { export1 , export2 as alias2  } from "module-name";
			return s.replace(/^\{([^\}]*)\}\s*from\s*([\'\"][^\'\"]+[\'\"])[\s;]*$/,
				function (m, p1, p2) {
					//NamedImports
					return formatSourceComment(source, sourceComment) +
						"var " + formatNamedImports(p1, null, p2) + ";";
				});
		case "\"":	//import "module-name";
			return s.replace(/^([\'\"][^\'\"]+[\'\"])[\s;]*$/,
				function (m, p1) {
					//import ModuleSpecifier;
					return formatSourceComment(source, sourceComment) +
						"require(" + p1 + ");";
				});
		default:	//import defaultExport (,* as \w+)? (,{...})? from "module-name";
			return s.replace(/^([^\s,]+)(\s*,\s*\*\s*as\s+[^\s,]+)?(\s*,\s*\{[^\}]*\})?\s*from\s*([\'\"][^\'\"]+[\'\"])[\s;]*$/,
				function (m, p1, p2, p3, p4) {

					if (!p2 && !p3) {
						//ImportedDefaultBinding
						return formatSourceComment(source, sourceComment) +
							"var " + p1 + "= require(" + p4 + ");";
					}
					else if (!p3) {
						//ImportedDefaultBinding,NameSpaceImport
						return formatSourceComment(source, sourceComment) +
							"var " + p1 + "= require(" + p4 + "),\n\t" + p2.match(/\S+$/)[0] + "= " + p1 + ";";
					}
					else if (!p2) {
						//ImportedDefaultBinding,NamedImports
						return formatSourceComment(source, sourceComment) +
							"var " + p1 + "= require(" + p4 + "),\n\t" + formatNamedImports(p3, p1) + ";";
					}
					else return m;	//unknown
				});
	}
}

//var debugFlag=1;

module.exports = browserify_transform_tools.makeFalafelTransform(
	"import-to-require",
	{ falafelOptions: { sourceType: 'module', ecmaVersion: ECMA_VERSION }, jsFilesOnly: true },
	function (node, transformOptions, done) {
		/*
		console.log("-----------------------");
		console.log(node.type);
		console.log(node.source());
		console.log(node);
		*/

		/*
		if(debugFlag){
			console.log(transformOptions.config);
			debugFlag=0;
		}
		*/

		if (node.type === 'ImportDeclaration') {
			var source = node.source();
			if (transformOptions.config && transformOptions.config.debugMatch) {
				console.log("match: " + source);
			}
			//console.log("clear: "+removeComment(node.source()));
			var newSource = transfer(source, transformOptions.config && transformOptions.config.sourceComment);

			if (newSource && source !== newSource) {
				//console.log("new  : "+newSource);
				node.update(newSource);
			}
		}

		done();
	}
);
