'use strict';

var expect = require('chai').expect;

var child_process = require("child_process");
require('chai').should();

var JVM = require("../index");
var jvm = new JVM();

describe('Object', function () {
    before(function(done){
        this.timeout(10000);
        child_process.exec("javac _static/Main.java _static/Object.java", {cwd : __dirname},function(err){
            if (err) throw err;
            jvm.loadClassFile(__dirname + "/_static/Main.class");
            jvm.loadClassFile(__dirname + "/_static/Object.class");
            done();
        });
    });

    describe("equals", function () {
        it("should return true for default number", function () {
            var main = CLASSES.createNewObject("_static/Main");
            expect(main.o.getNumber()).to.be.equal(1);
        });
        
        it("should return true for custom number", function () {
            var main = CLASSES.createNewObject("_static/Main");
            main.o.setNumber(1000);
            expect(main.o.getNumber()).to.be.equal(1000);
        });
    });
    
});