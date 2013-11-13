'use strict';

var expect = require('chai').expect;

var child_process = require("child_process");
require('chai').should();

var JVM = require("../index");
var jvm = new JVM();

describe('Object', function () {
    before(function(done){
        this.timeout(10000);
        child_process.exec("javac _basic/Object.java", {cwd : __dirname},function(err){
            if (err) throw err;
            jvm.loadClassFile(__dirname + "/_basic/Object.class");
            done();
        });
    });

    describe("equals", function () {
        it("should return true for same instance", function () {
            var o = CLASSES.newObject("_basic/Object");
            expect(o.equals(o)).to.be.true;
        });

        it("should return false for different instances", function () {
            var o1 = CLASSES.newObject("_basic/Object");
            var o2 = CLASSES.newObject("_basic/Object");
            expect(o1.equals(o2)).to.be.false;
        });
    });
    
    describe("getClass", function () {
        it("return correct class object", function () {
            var o = CLASSES.newObject("_basic/Object");
            expect(o.getClassName()).to.be.equal("_basic/Object");
        });
    });

    describe("toString", function () {
        it("return correct class object", function () {
            var o = CLASSES.newObject("_basic/Object");
            expect(o.toString()).to.be.equal("_basic/Object" + '@' + o.hashCode().toString(16));
        });
    });

    describe("hashcode", function () {
        it("should return an int", function () {
            var o = CLASSES.newObject("_basic/Object");
            expect(o.hashCode()).to.be.a('number');
            expect(o.hashCode()).to.be.greaterThan(0);
        });

        it("should be different for different instances", function () {
            var o1 = CLASSES.newObject("_basic/Object");
            var o2 = CLASSES.newObject("_basic/Object");
            expect(o1.hashCode()).not.to.be.equal(o2.hashCode());
        });
    });
});