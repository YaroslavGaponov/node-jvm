node-jvm
========

## Overview

node-jvm - jvm in pure node.js


## Example

### java
```java
public class Main {

    public static long fib(int n) {
        if (n <= 1) return n;
        return fib(n-1) + fib(n-2);
    }

    public static void main(String[] args) {
        if (args.length == 0) {
            System.out.print("help: java Main.class {Number}");
            return;
        }

        int N = Integer.parseInt(args[0]);
        long start = System.currentTimeMillis();
        System.out.format("Fibonacci from 1 to %s:\n", N);
        for (int i = 1; i <= N; i++) {
            System.out.println(i + ": " + fib(i));
        }
        long stop = System.currentTimeMillis();
        System.out.println("time: " + (stop - start) + "ms");

        System.out.println("done.");
    }
}
```

### node.js
```javascript
var JVM = require("../../index");
var jvm = new JVM();
jvm.loadClassFile("./Main.class");
jvm.run([10]);
```

### build java files
`cd examples fibonacci; make`

### run jvm
`./fibonacci.js`

### clean
`make clean`

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
time: 18ms
done.
```

### other examples
`cd examples/`

```
cast
dogs
fibonacci
idogs
static
switcher
```


## Developer

Yaroslav Gaponov (yaroslav.gaponov -at - gmail.com)
