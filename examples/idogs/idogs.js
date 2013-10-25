#!/usr/bin/env node

var JVM = require("../../index");
var jvm = new JVM();
jvm.loadClassFile("./Main.class");
jvm.loadClassFile("./IDog.class");
jvm.loadClassFile("./Dog.class");
jvm.run();