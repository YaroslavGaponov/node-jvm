public class Main {

	public static int test(int i) {
		switch (i) {
		case 1:  return (10);
		case 10: return (100);
		default: return (0);
		}
	}

	public static void main(String[] args) {

		System.out.println("test: " + test(10));

		for (int i = 10; i <= 13; i++) {
			switch (i) {
			case 10:
				System.out.println("10");
				break;
			case 11: case 12:
				System.out.println("11 or 12");
				break;
			default:
				System.out.println("13");
			}
		}
	}

}
