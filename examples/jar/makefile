JFLAGS = -g
JC = javac

JAR = jar
JARFLAGS = cvfe

.SUFFIXES: .java .class .jar

.java.class:
	$(JC) $(JFLAGS) $*.java

.class.jar:
	$(JAR) $(JARFLAGS) Main.jar Main *.class

CLASSES = \
	Main.java 

default: jar

classes: $(CLASSES:.java=.class)

jar: $(CLASSES:.java=.jar)

clean:
	$(RM) *.class
	$(RM) *.jar