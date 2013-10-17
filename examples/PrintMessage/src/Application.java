
public class Application {

	
	public static long fib(int n) {
        if (n <= 1) return n;
        else return fib(n-1) + fib(n-2);
    }
	
	public static void main(String[] args) {
		
		if (args.length == 0) {
			System.out.print("help: java Application {Number}");
			System.exit(-1);
		}
		
		int N = Integer.parseInt(args[0]);
		
		System.out.println("Fibonacci:");
		for (int i = 1; i <= N; i++)
            System.out.println(i + ": " + fib(i));		
		
		
		System.out.println("Plays with objects:");
		Object o = new Object();		
		System.out.println(o.toString());
		
		StringBuilder sb = new StringBuilder("hello");
		sb.append(" test 1");
		sb.append(" test 2");
		sb.append(" test 3");
		System.out.println(sb.toString());
		
		System.out.println(sb.equals(sb));
		System.out.println(sb.equals(o));
		
        
	}
}
