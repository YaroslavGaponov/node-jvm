var JVM = require("../index");
var jvm = new JVM();
jvm.loadClassFile("./BaseObjects/bin/examples/BaseObjects/Main.class");
jvm.loadClassFile("./BaseObjects/bin/examples/BaseObjects/Dog.class");
jvm.run(["Smally"]);