#!/usr/bin/env node

var JVM = require("../../index");
var jvm = new JVM();
jvm.loadClassFiles(__dirname);
jvm.loadJSFile(__dirname + "/MyJsClass.js");
jvm.run();