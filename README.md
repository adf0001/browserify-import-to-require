# browserify-import-to-require
A browserify transform, transfering static import statement to require statement.

# Accepted format
```javascript

//refer https://262.ecma-international.org/11.0/#sec-imports
//refer https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import

import defaultExport from "module-name";
import * as name from "module-name";
import { export1 } from "module-name";
import { export1 as alias1 } from "module-name";
import { export1 , export2 } from "module-name";
import { export1 , export2 as alias2 , [...] } from "module-name";
import defaultExport, { export1 [ , [...] ] } from "module-name";
import defaultExport, * as name from "module-name";
import "module-name";

```

# Limitation

* do not transfer dynamic import-calling, that is, `import(...)` with round brackets;

# Install
```
npm install browserify-import-to-require
```

# Usage
```shell
browserify ... -g [ "browserify-import-to-require" ] ...

# or

browserify ... -g [ "browserify-import-to-require"  --debugInfo --sourceComment --defaultKey default ] ...

# or with "appliesTo.files"/"appliesTo.includeExtensions" arguments for browserify-transform-tools
# default "appliesTo.jsFilesOnly"

	# require array type, at least 2 items in Windows, refer browserify-transform-tools and minimist.
	-g [ "browserify-import-to-require" --appliesTo [ --files my.js --files my2.js ] ]

	-g [ "browserify-import-to-require" --appliesTo [ --includeExtensions .js --includeExtensions .js ] ]

```

# Samples
```javascript

//import def111/*ccc*/from "module-name"/*as*/;
var def111= require("module-name");     //comment as splitter


//import def222 from "module-name";
var def222= require("module-name");     ///bbb

//import * as name from "module-name";
var name= require("module-name");

//import*as nameb from"module-name";
var nameb= require("module-name");      //special spaces


//import { export1 } from "module-name";
var export1= require("module-name").export1;

//import { export1 as alias1 } from "module-name";
var alias1= require("module-name").export1;


//import { export1a , export2a } from "module-name";
var module_name= require("module-name"),
        export1a= module_name.export1a,
        export2a= module_name.export2a;

//import {export1b, export2b as alias2 } from "module-name";
var module_name= require("module-name"),
        export1b= module_name.export1b,
        alias2= module_name.export2b;

//import{export1cc,export2b as alias2b}from"module-name";
var module_name= require("module-name"),
        export1cc= module_name.export1cc,
        alias2b= module_name.export2b;  //special spaces

//import defaultExport, { export1c, export2c } from "module-name";
var defaultExport= require("module-name"),
        export1c= defaultExport.export1c,
        export2c= defaultExport.export2c;

//import defaultExport2,*as name2 from "module-name";
var defaultExport2= require("module-name"),
        name2= defaultExport2;

//import     defaultExport2b, * as name2b from "module-name";
var defaultExport2b= require("module-name"),
        name2b= defaultExport2b;        //special spaces

//import "module-name";
require("module-name");

//multiple statement in 1 line
//import defaultExport3 from "module-name";
var defaultExport3= require("module-name");
//import defaultExport4 from "module-name2";
var defaultExport4= require("module-name2");

var promise = import("module-name");    //do not transfer dynamic import-calling

//single import statement in multiple lines
//import defaultExport5\n     from/*mmm*/\n     "module-name";
var defaultExport5= require("module-name");

//not started at line head
"strict mode";
//import defaultExport6 from "module-name";
var defaultExport6= require("module-name");

//block comment
/*
import defaultExport from "module-name";
*/
/*
import defaultExport from "module-name";*/


//template strings
var s=`gfgsdfgsdf
import defaultExport from 'module-name';
fasdfas`;

var s=`gfgsdfgsdf
import defaultExport from 'module-name'`;

//multiple string, lined with ending '\'
var s="gfgsdfgsdf\
import defaultExport from 'module-name';\
fasdfas";

var s="gfgsdfgsdf\
import defaultExport from 'module-name';";

```
