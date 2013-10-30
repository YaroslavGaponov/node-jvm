public class Main {

	public static void main(String[] args) {
		int[][][] multi = new int[20][30][40];
		int[] numbers = { 1, 2, 3, 4, 5, 6, 7, 8, 9 };

		String[] nicks = { "Mike", "Bob", "Alex" };

		Dog[] dogs = new Dog[nicks.length];

		for (int i = 0; i < dogs.length; i++) {
			dogs[i] = new Dog(nicks[i]);
		}

		for (int i = 0; i < dogs.length; i++) {
			dogs[i].say();
		}
	}

}