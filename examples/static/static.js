#!/usr/bin/env node

var JVM = require("../../index");
var jvm = new JVM();
jvm.loadClassFile("./Main.class");
jvm.loadClassFile("./MyOut.class");
jvm.loadClassFile("./MySystem.class");
jvm.run();