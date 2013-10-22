package examples.BaseObjects;

class Dog {
	private String name;
	public Dog(String name) {
		this.name = name;
	}
	
	public void say(String message) {
		System.out.print(name + " says: " + message);
	}
}

public class Main {

	public static void main(String[] args) {
		Dog dog = new Dog(args[0]);
		dog.say("hello, nice day!");
		
	}

}
