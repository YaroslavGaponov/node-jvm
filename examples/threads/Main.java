
public class Main  {

	public static void main(String[] args) {
            Dog mike = new Dog("Mike", 10);
            Thread mikeThread = new Thread(mike);
            
            Dog sten = new Dog("Sten", 15);
            Thread stenThread = new Thread(sten);
            
            mikeThread.start();
            stenThread.start();

	}

}
