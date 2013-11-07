public class Main {
	public static void main(String[] args) {
		MySystem.out.println("id = " + MySystem.out.id);
		
		MyOut o = MySystem.out;
		o.id = "changed 1";
		o.println("id = " + o.id);
		
		MySystem.out = new MyOut("changed 2");
		MySystem.out.println("id = " + MySystem.out.id);
	}
}
