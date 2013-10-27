
public class Main {

	public static void main(String[] args) {
            Dog mike = new Dog("Mike");
            Thread mikeThread = new Thread(mike);
            
            Dog sten = new Dog("Sten");
            Thread stenThread = new Thread(sten);
            
            mikeThread.start();
            stenThread.start();            
	}

}
