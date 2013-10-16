var JVM = require("../index");
var jvm = new JVM();
jvm.loadClassFile("./PrintMessage/bin/Application.class");
jvm.run([10]);