var JVM = require("../index");
var jvm = new JVM();
jvm.loadClassFile("./Interfaces/bin/example/Main.class");
jvm.loadClassFile("./Interfaces/bin/example/IDog.class");
jvm.loadClassFile("./Interfaces/bin/example/Dog.class");
jvm.run();