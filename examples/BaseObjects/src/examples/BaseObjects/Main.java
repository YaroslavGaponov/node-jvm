package examples.BaseObjects;

public class Main {

	public static void main(String[] args) {
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
