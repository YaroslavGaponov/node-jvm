var JVM = require("../index");
var jvm = new JVM();
jvm.loadClassFile("./Converter/bin/examples/Converter/Main.class");
jvm.run();