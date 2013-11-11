#!/usr/bin/env node

var JVM = require("../../index");
var jvm = new JVM();
jvm.setLogLevel(7);
jvm.loadClassFiles(__dirname);
jvm.on("exit", function(code) {
    process.exit(code);
});
jvm.run([15]);