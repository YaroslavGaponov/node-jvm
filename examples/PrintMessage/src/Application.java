
public class Application {

	public static void main(String[] args) {
		
		if (args.length == 0) {
			System.out.print("java Application {Number}");
			System.exit(0);
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
