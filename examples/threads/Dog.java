class Dog implements Runnable {
	private String name;
	private int length;

	public Dog(String name, int length) {
		this.name = name;
		this.length = length;
	}

	public void run() {
		for (int i = 0; i < length; i++) {
			System.out.println("Hello from " + name + ": " + i);
		}
	}

}