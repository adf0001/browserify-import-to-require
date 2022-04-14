
var path = require("path");
var browserify_transform_tools = require('browserify-transform-tools');

function formatNamedImports(s, spaceName, moduleName) {
	var sn = spaceName || moduleName.replace(/\W/g, "_");

	var sa = s.replace(/(^[\s\{,]+|[\s\},]+$)/g, "").split(",");
	var i, imax = sa.length, si, mr, a = [];
	for (i = 0; i < imax; i++) {
		si = sa[i];
		mr = si.match(/^\s*(\w+)(\s+as\s+\w+)?/);
		if (!mr) continue;	//may empty

		if (mr[2]) a[a.length] = mr[2].match(/\w+$/)[0] + " = " + sn + "." + mr[1];
		else a[a.length] = mr[1] + " = " + sn + "." + mr[1];
	}

	if (!a.length) return "";

	if (spaceName) return "var " + a.join(",\n\t");	//spaceName already exists

	if (a.length === 1 && !spaceName) {
		//only 1 item
		if (mr[2]) return "var " + mr[2].match(/\w+$/)[0] + " = require(\"" + moduleName + "\")." + mr[1];
		else return "var " + mr[1] + " = require(\"" + moduleName + "\")." + mr[1];
	}

	return "var " + sn + " = require(\"" + moduleName + "\");" +
		"\nvar " + a.join(",\n\t");
}

module.exports = browserify_transform_tools.makeStringTransform(
	"import-to-require", null,
	function (content, transformOptions, done) {
		//console.log(path.extname(transformOptions.file));

		//var mr = content.match(/^\s*import\s+(\w+)\s+from\s[\'\"]([^\'\"]+)[\'\"][\s\;]*$/m);
		//var mr = content.match(/^\s*import\s+(\w+)\s+from\s([\'\"][^\'\"]+[\'\"])/mg);
		//if (mr) console.log(mr[0]);

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

		content = content
			//import defaultExport (,* as \w+)? (,{...})? from "module-name";
			.replace(/^[^\S\r\n]*import\s+(\w+)(\s*,\s*\*\s*as\s+\w+)?(\s*,\s*\{[^\}]*\})?\s*from\s+[\'\"]([^\'\"]+)[\'\"].*/mg,
				function (m, p1, p2, p3, p4) {
					console.log("match: " + m);
					if (!p2 && !p3) {
						//ImportedDefaultBinding
						return "//" + m + "\nvar " + p1 + " = require(\"" + p4 + "\");\n";
					}
					else if (!p3) {
						//ImportedDefaultBinding,NameSpaceImport
						return "//" + m + "\nvar " + p1 + " = require(\"" + p4 + "\");" +
							"\nvar " + p2.match(/\w+$/)[0] + " = " + p1 + ";\n";
					}
					else if (!p2) {
						//ImportedDefaultBinding,NamedImports
						return "//" + m + "\nvar " + p1 + " = require(\"" + p4 + "\");" +
							"\n" + formatNamedImports(p3, p1)+";\n";
					}
					else return "\n//" + m + "\nwaiting....";
				})
			//import * as name from "module-name";
			.replace(/^[^\S\r\n]*import\s*\*\s*as\s+(\w+)\s+from\s+[\'\"]([^\'\"]+)[\'\"].*/mg,
				function (m, p1, p2) {
					//NameSpaceImport
					console.log("match: " + m);
					return "//" + m + "\nvar " + p1 + " = require(\"" + p2 + "\");\n";
				})
			//import { export1 , export2 as alias2  } from "module-name";
			.replace(/^[^\S\r\n]*import\s*\{([^\}]*)\}\s*from\s+[\'\"]([^\'\"]+)[\'\"].*/mg,
				function (m, p1, p2) {
					console.log("match: " + m);

					//NamedImports
					return "//" + m +
						"\n" + formatNamedImports(p1, null, p2)+";\n";
				})
			//import "module-name";
			.replace(/^[^\S\r\n]*import\s*[\'\"]([^\'\"]+)[\'\"].*/mg,
				function (m, p1) {
					console.log("match: " + m);

					//import ModuleSpecifier;
					return "//" + m +
						"\nrequire(\"" + p1 + "\");\n";
				})
			/*
			//var promise = import("module-name");
			ImportCall:import(AssignmentExpression)
				dynamic loading, unsupport.
			*/
			;

		done(null, content);
	}
);
