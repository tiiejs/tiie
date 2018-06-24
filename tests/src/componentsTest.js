import Components from 'Components';

class Component {
    constructor(name) {
        let p = this.private = {
            counter : 0,
            name
        };
    }

    name() {
        return this.private.name;
    }

    counter() {
        return ++this.private.counter;
    }
}

export default function(body) {
    describe('Components', function() {
        it('Creating component', function () {
            // let local = new Component("Api");

            let components = new Components({
                'api' : () => {
                    return new Component("Api");
                }
            });

            expect(components.get("api").name()).to.be.equal("Api");
            expect(components.get("api").counter()).to.be.equal(1);
        });

        it('Component as service', function () {
            let components = new Components({
                '@apiOne' : () => {
                    return new Component("ApiOne");
                },
                'apiTwo' : () => {
                    return new Component("ApiTwo");
                }
            });

            expect(components.get("@apiOne").name()).to.be.equal("ApiOne");
            expect(components.get("apiTwo").name()).to.be.equal("ApiTwo");

            expect(components.get("@apiOne").counter()).to.be.equal(1);
            expect(components.get("@apiOne").counter()).to.be.equal(2);
            expect(components.get("@apiOne").counter()).to.be.equal(3);

            expect(components.get("apiTwo").counter()).to.be.equal(1);
            expect(components.get("apiTwo").counter()).to.be.equal(1);
            expect(components.get("apiTwo").counter()).to.be.equal(1);
        });

        it('Set component', function () {
            let api = new Component("Api");

            let components = new Components();
            components.set("@api", api);

            expect(components.get("@api").name()).to.be.equal("Api");
            expect(components.get("@api").counter()).to.be.equal(1);
            expect(components.get("@api").counter()).to.be.equal(2);
            expect(components.get("@api").counter()).to.be.equal(3);
        });
    });
};
