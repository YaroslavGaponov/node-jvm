class Dog implements Runnable {
        private Object obj;
	private String name;
	private int length;

        
        public Dog(String name, int length, Object obj) {
                this.obj = obj;
		this.name = name;
                this.length = length;
	}

	public void run() {
                if (obj != null) {
                    synchronized(obj) {
                        for (int i = 0; i < length; i++) {
                            System.out.println("Hello from lock " + name + ": " + i);
                        }
                    }
                } else {
                    for (int i = 0; i < length; i++) {
                    	System.out.println("Hello from non-lock " + name + ": " + i);
                    }
                }
	}

}