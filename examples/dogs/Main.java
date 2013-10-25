
class Dog {
	private String name;
	public Dog(String name) {
		this.name = name;
	}
	
	public void say(String message) {
		System.out.println(name + " says: " + message);
	}
}

public class Main {

	public static void main(String[] args) {
		Dog mike = new Dog("Mike");
		Dog sten = new Dog("Sten");
		mike.say("hello, nice day!");
		sten.say("woof!");
		mike.say("good bye!");
	}

}
