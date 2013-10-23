package example;

public class Main {
	public static void main(String[] args) {
		MyOut out = MySystem.out;
		System.out.println(String.valueOf(out.hashCode()));
		out.println("Hello");
	}
}
