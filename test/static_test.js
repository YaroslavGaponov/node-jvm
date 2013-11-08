'use strict';

var expect = require('chai').expect;

var child_process = require("child_process");
require('chai').should();

var JVM = require("../index");
var jvm = new JVM();

describe('Object', function () {
    before(function(done){
        this.timeout(10000);
        child_process.exec("javac _static/Main.java _static/Nested.java", {cwd : __dirname},function(err){
            if (err) throw err;
            jvm.loadClassFiles(__dirname + "/_static");
            CLASSES.cinit();
            done();
        });
    });

    describe("equals", function () {
        it("should return true for default number", function () {
            var main = CLASSES.createNewObject("_static/Main");
            CLASSES.getStaticField("_static/Main","o").getNumber.run([main], function(number) {
                expect(number).to.be.equal(1);
            });
        });
        
        it("should return true for custom number", function () {
            var main = CLASSES.createNewObject("_static/Main");
            CLASSES.getStaticField("_static/Main","o").setNumber.run([main, 1000], function() {
                CLASSES.getStaticField("_static/Main","o").getNumber.run([main], function(number) {
                     expect(number).to.be.equal(1000);
                });
            });
        });
    });
    
});