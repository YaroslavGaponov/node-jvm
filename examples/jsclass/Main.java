public class Main {


	public static void main(String[] args) throws ClassNotFoundException, InstantiationException, IllegalAccessException {
		IMyJsClass obj = (IMyJsClass) Class.forName("jvm/examples/jsclass/MyJsClass").newInstance();
		obj.init("Tom");
		System.out.println("My nick is " + obj.getName());
		obj.say("Hello from java to node");
		obj.bye();
	}

}
