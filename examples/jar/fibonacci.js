#!/usr/bin/env node

var JVM = require("../../index");
var jvm = new JVM();
jvm.setLogLevel(7);
var entryPointClassName = jvm.loadJarFile("./Main.jar");
jvm.setEntryPointClassName(entryPointClassName);
jvm.on("exit", function(code) {
    process.exit(code);
});
jvm.run([15]);