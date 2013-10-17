
public class Application {

	public static void main(String[] args) {
		
		Object o = new Object();		
		System.out.println(o.toString());
		
		StringBuilder sb = new StringBuilder();
		sb.append("test");
		System.out.println(sb.toString());
		
		System.out.println(sb.equals(sb));
		System.out.println(sb.equals(o));
		
		
		if (args.length == 0) {
			System.out.print("help: java Application {Number}");
			System.exit(-1);
		}
		
		int N = Integer.parseInt(args[0]);
		
		System.out.format("Print from 1 to %s", N);		
		System.out.println();
        for (int i = 1; i <= N; i++) {
        	System.out.println(i);
        }
        
        System.out.format("Hello %s %s", "Word", "!!!");
        
	}
}
