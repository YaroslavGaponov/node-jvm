'use strict';

var expect = require('chai').expect;

var child_process = require("child_process");
require('chai').should();


var JVM = require("../index");
var jvm = new JVM();

describe('Object', function () {
    before(function(done){
        this.timeout(10000);
        child_process.exec("javac SomeObject.java",{cwd : __dirname},function(err){
            if (err) throw err;
            jvm.loadClassFiles(__dirname);
            done();
        });


    });

    describe("equals", function () {
        it("should return true for same instance", function () {
            var o1=CLASSES.createNewObject("SomeObject");
            expect(o1.equals(o1)).to.be.true;

        });

        it("should return false for different instances", function () {
            var o1=CLASSES.createNewObject("SomeObject");
            var o2=CLASSES.createNewObject("SomeObject");
            expect(o1.equals(o2)).to.be.false;

        });
    });
   /* describe("getClass", function () {
        it("return correct class object", function () {
            var o1=CLASSES.createNewObject("SomeObject");

            expect(o1.getClass().getSimpleName()).to.be.equal('SomeObject');


        });
    });

    describe("toString", function () {
        it("return correct class object", function () {
            var o1=CLASSES.createNewObject("SomeObject");

            expect(o1.toString()).to.be.equal("SomeObject@"+o1.hashCode().toString(16));


        });
    });*/

    describe("hashcode", function () {
        it("should return an int", function () {
            var o1=CLASSES.createNewObject("SomeObject");
            expect(o1.hashCode()).to.be.a('number');

            expect(o1.hashCode()).to.be.greaterThan(0);

        });

        it("should be different for different instances", function () {
            var o1=CLASSES.createNewObject("SomeObject");
            var o2=CLASSES.createNewObject("SomeObject");
            expect(o1.hashCode()).not.to.be.equal(o2.hashCode());
        });

    });
});