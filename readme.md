node-jvm
========

## Overview

node-jvm - jvm in pure node.js


## Example

### java
```java
package examples.Fibonacci;

public class Main {
	
	public static long fib(int n) {
            if (n <= 1) return n;
            else return fib(n-1) + fib(n-2);
        }
        
	public static void main(String[] args) {
            if (args.length == 0) {
                    System.out.print("help: java main {Number}");
                    System.exit(-1);
            }		
		
            int N = Integer.parseInt(args[0]);
            
            System.out.format("Fibonacci from 1 to %s:\n", N);
            for (int i = 1; i <= N; i++) {
                System.out.println(i + ": " + fib(i));
	    }
		
	    System.out.println("done.");
	}
}
```

### node.js
```javascript
var JVM = require("../index");
var jvm = new JVM();
jvm.loadClassFile("./Fibonacci/bin/examples/Fibonacci/Main.class");
jvm.run([10]);
```

### run
`node fibonacci.js`

### output
```
Fibonacci from 1 to 10:
1: 1
2: 1
3: 2
4: 3
5: 5
6: 8
7: 13
8: 21
9: 34
10: 55
done.
```

## Contributors

Yaroslav Gaponov (yaroslav.gaponov -at - gmail.com)