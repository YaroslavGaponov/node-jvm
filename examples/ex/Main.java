public class Main {
	
	public static void main(String[] args) {
		try {
			throw new NullPointerException("This is NullPointerException !!!");
		} catch (NullPointerException ex) {
			throw new ArrayIndexOutOfBoundsException("This is ArrayIndexOutOfBoundsException !!!");
		} finally {
			throw new IllegalArgumentException("This is IllegalArgumentException !!!");
		}
	}

}
