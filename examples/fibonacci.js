var JVM = require("../index");
var jvm = new JVM();
jvm.loadClassFile("./Fibonacci/bin/examples/Fibonacci/Main.class");
jvm.run([10]);