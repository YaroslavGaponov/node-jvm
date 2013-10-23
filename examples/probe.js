var JVM = require("../index");
var jvm = new JVM();
jvm.loadClassFile("./Probe/bin/example/Main.class");
jvm.loadClassFile("./Probe/bin/example/MyOut.class");
jvm.loadClassFile("./Probe/bin/example/MySystem.class");
jvm.run();