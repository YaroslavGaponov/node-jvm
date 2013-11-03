'use strict';

var expect = require('chai').expect;

var child_process = require("child_process");
require('chai').should();


var JVM = require("../index");
var jvm = new JVM();

describe('Operator', function () {
    var o1;
    before(function (done) {
        this.timeout(5000);
        child_process.exec("javac Operators.java", {cwd: __dirname}, function (err) {
            if (err) throw err;
            jvm.loadClassFiles(__dirname);
            o1= process.JVM.Loader.createNewObject("Operators");

            done();
        });


    });
    describe("with ints", function () {
        describe("+", function () {
            it("return sum", function (done) {
    
                o1.sum.run([o1, 20, 22], function (result) {
                    expect(result).to.be.equal(42);
                    done();
                });
            });
        });
    
        describe("*", function () {
            it("return multiplication", function (done) {
    
                o1.multiply.run([o1, 21, 2], function (result) {
                    expect(result).to.be.equal(42);
                    done();
                });
            });
        });
    
        describe("-", function () {
            it("return subtraction", function (done) {
    
                o1.subtract.run([o1, 64, 22], function (result) {
                    expect(result).to.be.equal(42);
                    done();
                });
            });
        });
    
        describe("/", function () {
            it("return division", function (done) {
    
                o1.divide.run([o1, 84, 2], function (result) {
                    expect(result).to.be.equal(42);
                    done();
                });
            });
        });
    
        describe("%", function () {
            it("return remaind", function (done) {
    
                o1.remaind.run([o1, 1042, 1000], function (result) {
                    expect(result).to.be.equal(42);
                    done();
                });
            });
        });
    });
/*
    describe("with longs", function () {
        describe("+", function () {
            it("return sum", function (done) {

                o1.sumLong.run([o1, 20, 22], function (result) {
                    expect(result).to.be.equal(42);
                    done();
                });
            });
        });

        describe("*", function () {
            it("return multiplication", function (done) {

                o1.multiplyLong.run([o1, 21, 2], function (result) {
                    expect(result).to.be.equal(42);
                    done();
                });
            });
        });

        describe("-", function () {
            it("return subtraction", function (done) {

                o1.subtractLong.run([o1, 64, 22], function (result) {
                    expect(result).to.be.equal(42);
                    done();
                });
            });
        });

        describe("/", function () {
            it("return division", function (done) {

                o1.divideLong.run([o1, 84, 2], function (result) {
                    expect(result).to.be.equal(42);
                    done();
                });
            });
        });

        describe("%", function () {
            it("return remaind", function (done) {

                o1.remaindLong.run([o1, 1042, 1000], function (result) {
                    expect(result).to.be.equal(42);
                    done();
                });
            });
        });
    });*/
});

