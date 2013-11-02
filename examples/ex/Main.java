public class Main {
	
	public static void ex() throws ArithmeticException {
		throw new ArithmeticException("This is ArithmeticException !!!");
	}
	
	public static void main(String[] args) {
		try {
			System.out.println("try...");
			throw new NullPointerException("This is NullPointerException !!!");
		} catch (NullPointerException ex) {
			System.out.println("catch...");
			throw new SecurityException("This is SecurityException  !!!");
		} finally {
			System.out.println("finally...");
			ex();
			throw new IllegalArgumentException("This is IllegalArgumentException !!!");
		}
	}

}
