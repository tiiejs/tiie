import TopiObject from 'Topi/Object';
import expect from 'expect.js';

export default function(body) {
    describe('Object', function() {

        describe('Setting and getting', function() {
            it('self reference', function () {
                let object = new TopiObject();
                let result = object.set("name", "Foo")

                expect(result).to.be.equal(object);
            });

            it('check value', function () {
                let object = new TopiObject();
                let result = object.set("name", "Foo")

                expect(object.get('name')).to.be.equal("Foo");
            });

            it('multi types', function () {
                let object = new TopiObject();
                let types = {
                    number : 1,
                    string : "foo",
                    array : [1, 2, {name : 1}],
                };

                object.set("number", types.number);
                object.set("string", types.string);
                object.set("array", types.array);

                expect(object.get('number')).to.be.eql(types.number);
                expect(object.get('string')).to.be.eql(types.string);
                expect(object.get('array')).to.be.eql(types.array);
            });

            it('get by reference', function () {
                let object = new TopiObject();
                object.set("list", [1, 2, {name : 1}]);

                let list = object.get("list", null, {clone : 0});

                expect(object.get('list')).to.be.eql(list);
                expect(object.get('list', null, {clone : 0})).to.be.equal(list);
                expect(object.get('&list')).to.be.equal(list);
            });

            it('sub values', function () {
                let object = new TopiObject();
                object.set("value", {name : "foo"});
                object.set("value.async", 1);

                expect(object.get('value')).to.be.eql({name : "foo"});
                expect(object.get('value.async')).to.be.equal(1);
            });

            it('all data', function () {
                let object = new TopiObject();
                object.set("value", {name : "foo"});
                object.set("value.async", 1);

                console.log('data', object.data());
                // expect(object.get('value')).to.be.eql({name : "foo"});
                // expect(object.get('value.async')).to.be.equal(1);
            });
        });

        describe('Events', function() {
            it('init', function (done) {
                let object = new TopiObject();

                object.on("value:init", (event, params) => {

                    expect(event.name).to.be.eql("value:init");
                    expect(event.this).to.be.equal(object);

                    done();
                });

                object.set("value", 10);
            });

            it('change', function (done) {
                let object = new TopiObject();
                object.set("value", 10);

                object.on("value:change", (event, params) => {

                    expect(event.name).to.be.eql("value:change");
                    expect(event.this).to.be.equal(object);

                    // params should has previous value
                    expect(params.previous).to.be.equal(10);

                    // new value should be 20
                    expect(object.get("value")).to.be.equal(20);

                    done();
                });

                object.set("value", 20);
            });

            it('change silently mode', function (done) {
                let object = new TopiObject();
                let doned = 0;

                object.set("value", 10);

                object.on("value:change", (event, params) => {
                    doned = 1;
                    done("silently does not work")
                });

                object.set("value", 20, {silently : 1});

                setTimeout(function() {
                    if (doned == 0) {
                        done();
                    }
                }, 500);
            });

            it('change silently mode mark', function (done) {
                let object = new TopiObject();
                let doned = 0;

                object.set("value", 10);

                object.on("value:change", (event, params) => {
                    doned = 1;
                    done("silently does not work")
                });

                object.set("-value", 20);

                setTimeout(function() {
                    if (doned == 0) {
                        done();
                    }
                }, 500);
            });

            it('off group', function (done) {
                let object = new TopiObject(),
                    doned = 0
                ;

                object.set("value", 10);

                object.on("value:change", (event, params) => {
                    done("off does not work")

                    doned = 1;
                }, 'topi');

                object.off("topi");

                object.set("value", 20);

                setTimeout(function() {
                    if (doned == 0) {
                        done();
                    }
                }, 500);
            });

            it('off all', function (done) {
                let object = new TopiObject(),
                    doned = 0
                ;

                object.set("value", 10);

                object.on("value:change", (event, params) => {
                    if (doned == 0) {
                        done("off does not work")
                        doned = 1;
                    }
                }, 'topi');

                object.on("value:change", (event, params) => {
                    if (doned == 0) {
                        done("off does not work")
                        doned = 1;
                    }
                });

                object.off();

                object.set("value", 20);

                setTimeout(function() {
                    if (doned == 0) {
                        done();
                    }
                }, 500);
            });

            // it('event queue', function (done) {
            //     let object = new TopiObject(),
            //         doned = 0,
            //         checks
            //     ;

            //     object.set("value", 10);

            //     object.on("value:change", (event, params) => {

            //     }, 'topi');

            //     object.on("value:change", (event, params) => {

            //     });

            //     setTimeout(function() {
            //         if (doned == 0) {
            //             done();
            //         }
            //     }, 500);
            // });

            it('emit', function (done) {
                let object = new TopiObject(),
                    doned = 0,
                    counter = 0
                ;

                object.on("item:click", (event, params) => {
                    expect(event.name).to.be.eql("item:click");
                    expect(event.this).to.be.equal(object);
                    expect(params.name).to.be.equal('foo');

                    counter++;
                });

                object.on("item", (event, params) => {
                    expect(event.name).to.be.eql("item:click");
                    expect(event.this).to.be.equal(object);
                    expect(params.name).to.be.equal('foo');

                    counter++;
                });

                object.on(":click", (event, params) => {
                    expect(event.name).to.be.eql("item:click");
                    expect(event.this).to.be.equal(object);
                    expect(params.name).to.be.equal('foo');

                    counter++;
                });

                object.emit('item:click', {name : 'foo'});

                setTimeout(function() {
                    if (counter != 3) {
                        done("not all events call");
                    }else{
                        done();
                    }

                }, 1000);
            });
        });
    });
};

