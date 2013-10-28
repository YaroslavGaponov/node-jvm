#!/usr/bin/env node

var JVM = require("../../index");
var jvm = new JVM();
jvm.loadClassFiles(__dirname);
jvm.run();