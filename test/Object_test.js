'use strict';

var expect = require('chai').expect;

var child_process = require("child_process");
require('chai').should();


var JVM = require("../index");
var jvm = new JVM();

describe('Object', function () {
    before(function(done){
        child_process.exec("javac AnObject.java",{cwd : __dirname},function(err){
            if (err) throw err;
            jvm.loadClassFiles(__dirname);
            done();
        });


    });
    describe("equals", function () {
        it("should return true for same instance", function () {
            var o1=process.JVM.Loader.createNewObject("AnObject");
            expect(o1.equals(o1)).to.be.true;

        });

        it("should return true for different instances", function () {
            var o1=process.JVM.Loader.createNewObject("AnObject");
            var o2=process.JVM.Loader.createNewObject("AnObject");
            expect(o1.equals(o2)).to.be.false;

        });
    });
    describe("hashcode", function () {
        it("should return an int", function () {
            var o1=process.JVM.Loader.createNewObject("AnObject");
            expect(o1.hashCode()).to.be.a('number');

            expect(o1.hashCode()).to.be.greaterThan(0);

        });

        it("should be different for different instances", function () {
            var o1=process.JVM.Loader.createNewObject("AnObject");
            var o2=process.JVM.Loader.createNewObject("AnObject");
            expect(o1.hashCode()).not.to.be.equal(o2.hashCode());
        });

    });
});