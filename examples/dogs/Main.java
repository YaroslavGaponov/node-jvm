class Animal {
	private String name;

	public Animal(String name) {
		this.name = name;
	}

	public void say(String message) {
		System.out.println(name + " says: " + message);
	}
}

class Dog extends Animal {
	public Dog(String name) {
		super(name);
	}
}

class Cat extends Animal {
	public Cat(String name) {
		super(name);
	}
}

public class Main {

	public static void main(String[] args) {
		Animal mike = new Dog("Mike");		
		Animal sten = new Dog("Sten");
		System.out.println("mike is instanceOf Dog: " + (mike instanceof Dog));
		System.out.println("sten is instanceOf Dog: " + (sten instanceof Dog));
		System.out.println("sten is instanceOf Cat: " + (sten instanceof Cat));
		
		System.out.println("mike.hashCode: " + mike.hashCode());
		System.out.println("mike.toString: " + mike.toString());
		System.out.println("sten.hashCode: " + sten.hashCode());
		System.out.println("sten.toString: " + sten.toString());
		
		mike.say("hello, nice day!");
		sten.say("woof!");
		mike.say("good bye!");
	}

}
