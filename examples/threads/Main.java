public class Main {


	public static void main(String[] args) throws InterruptedException {
	    
		Object locker = new Object();
		
		Dog mike = new Dog("Mike", 10, locker);
		Thread mikeThread = new Thread(mike);

		Dog sten = new Dog("Sten", 15, locker);
		Thread stenThread = new Thread(sten);
		
		Dog nika = new Dog("Nika", 30);
		Thread nikaThread = new Thread(nika);
		nikaThread.setPriority(Thread.MAX_PRIORITY);
		
		mikeThread.start();
		stenThread.start();
		nikaThread.start();

		System.out.println("Done.");
	}

}
