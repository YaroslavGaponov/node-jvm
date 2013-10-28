
public class Main  {

	public static void main(String[] args) {
            
            String[] nicks = { "Mike", "Bob", "Alex" };
            
            Dog[] dogs = new Dog[nicks.length];
            for(int i=0; i<dogs.length; i++) {
                dogs[i] = new Dog(nicks[i]);
            }

            for(int i=0; i<dogs.length; i++) {
                dogs[i].say();
            }  
            
	}

}
