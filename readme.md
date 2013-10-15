node-jvm
========

## Overview

node-jvm - jvm in pure node.js


## Example

```javascript
var JVM = require("../index");
var jvm = new JVM();
jvm.loadClassFile("./PrintMessage/bin/Application.class");
jvm.run();
```

## Contributors

Yaroslav Gaponov (yaroslav.gaponov -at - gmail.com)