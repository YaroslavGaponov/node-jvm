public class Main {


	public static void main(String[] args) throws ClassNotFoundException, InstantiationException, IllegalAccessException {
		IMyJsClass obj = (IMyJsClass) Class.forName("java/examples/MyJsClass").newInstance();
		obj.say("Hello from js");
	}

}
