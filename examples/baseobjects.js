var JVM = require("../index");
var jvm = new JVM();
jvm.loadClassFile("./BaseObjects/bin/examples/BaseObjects/Main.class");
jvm.run();