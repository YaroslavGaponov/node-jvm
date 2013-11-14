public class Main {

	public static long fib(int n) {
		if (n <= 1)
			return n;
		return fib(n - 1) + fib(n - 2);
	}

	public static void main(String[] args) {
		if (args.length == 0) {
			System.out.print("help: java Fibonacci {Number}");
			return;
		}

		int N = Integer.parseInt(args[0]);

		long start = System.currentTimeMillis();
		System.out.format("Fibonacci from 1 to %s:\n", N);
		for (int i = 1; i <= N; i++) {
			System.out.println(i + ": " + fib(i));
		}
		long stop = System.currentTimeMillis();
		System.out.println("time: " + (stop - start) + "ms");

		System.out.println("done.");
	}
}
