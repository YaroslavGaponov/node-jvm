public class Main {

	public static long ladd(long a, long b) {
		return a + b;
	}

	
	public static double dadd(double a, double b) {
		return a + b;
	}

	public static void main(String[] args) {
		
		double da = 10.2;
		double db = -3.1;
		double dc = da + db;
		System.out.println(dc);
		System.out.println(dadd(da, db));
		
		long la = 10;
		long lb = -3;
		long lc = la + lb;
		System.out.println(lc);
		System.out.println(ladd(la, lb));
		
		byte b = 17;
		int i = b;
		long l = i;
		float f = l;
		double d = f;

		System.out.println(b);
		System.out.println(i);
		System.out.println(l);
		System.out.println(f);
		System.out.println(d);
	}

}
