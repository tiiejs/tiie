import View from 'View';

export default function(body) {
    describe('View', function() {
        it('Simple view', function () {
            let view = new View(`
                <div>
                    <div name="name">foo</div>
                    <div name="lastName">boo</div>
                </div>
            `);

            view
                .target(body.element())
                .render()
            ;

            expect(view.element("name").html()).to.be.equal('foo');
            expect(view.element("lastName").html()).to.be.equal('boo');

            body.clean();
        });
    });
};
