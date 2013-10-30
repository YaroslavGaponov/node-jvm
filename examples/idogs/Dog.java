public class Dog implements IDog {

	private String nick;

	public Dog(String nick) {
		this.nick = nick;
	}

	@Override
	public void say(String message) {
		System.out.println(nick + " says: " + message);
	}

}
