public class Main {
		
	public static void main(String[] args) {
		{
			Object[] a = new Object[10];
			try {
				Object b = a[11];
			} catch (ArrayIndexOutOfBoundsException ex) {
				System.out.println(ex);
			}
		}
		{
			Object[] a = null;
			try {
				Object b = a[11];
			} catch (NullPointerException ex) {
				System.out.println(ex);
			}
		}
	}

}
