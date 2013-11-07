#!/usr/bin/env node

var JVM = require("../../index");
var jvm = new JVM();
jvm.setLogLevel(0);
jvm.setSchedulerMaxTicks(1000);
jvm.loadClassFiles(__dirname);
jvm.run([15]);