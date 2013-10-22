package examples.BaseObjects;

class Dog {
	private String name;
	public Dog(String name) {
		this.name = name;
	}
	
	public void say(String message) {
		System.out.format("%s says: %s", name, message);
	}
}

public class Main {

	public static void main(String[] args) {
		Dog dog = new Dog("Small");
		dog.say("hello, nice day!");
		
	}

}
