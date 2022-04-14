
//refer https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import

import defaultExport from "module-name";
import * as name from "module-name";
import { export1 } from "module-name";
import { export1 as alias1 } from "module-name";
import { export1 , export2 } from "module-name";
import { export1 , export2 as alias2  } from "module-name";
import defaultExport, { export1 , export2 } from "module-name";
import defaultExport, * as name from "module-name";
import "module-name";
var promise = import("module-name");

  import  defaultExport  from  "module-name" ;
 import  *  as  name  from  "module-name" ;
 import  {  export1  }  from  "module-name" ;
 import  {  export1  as  alias1  }  from  "module-name" ;
 import  {  export1  ,  export2  }  from  "module-name";
 import  {  export1  ,  export2  as  alias2   }  from  "module-name" ;
 import  defaultExport ,  {  export1  ,  export2  }  from  "module-name" ;
 import  defaultExport ,  *  as   name  from  "module-name";    //ccc
 import   "module-name" ;
var promise = import("module-name");
