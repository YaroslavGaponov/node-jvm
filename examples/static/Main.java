public class Main {
	public static void main(String[] args) {
		MySystem.out.println("Hello");
		MySystem.out = new MyOut();
		MySystem.out.println("Hello2");
	}
}
