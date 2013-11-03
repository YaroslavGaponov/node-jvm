public class Main {


	public static void main(String[] args) throws InterruptedException {
	    
		Object locker = new Object();
		
		Dog mike = new Dog("Mike", 10, locker);
		Thread mikeThread = new Thread(mike);

		Dog sten = new Dog("Sten", 15, locker);
		Thread stenThread = new Thread(sten);
		
		Dog nika = new Dog("Nika", 30, null);
		Thread nikaThread = new Thread(nika);

		mikeThread.start();
		stenThread.start();
		nikaThread.start();

		mikeThread.join();
		stenThread.join();
		nikaThread.join();

		System.out.println("Done.");
	}

}
