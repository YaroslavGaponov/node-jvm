package examples.Switch;

public class Main {

	public static void main(String[] args) {
		for(int i=10; i<=13; i++) {
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
