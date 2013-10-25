var JVM = require("../index");
var jvm = new JVM();
jvm.loadClassFile("./Switch/bin/examples/Switch/Main.class");
jvm.run();