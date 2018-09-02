import ViewLoader from 'Topi/Dialog/Views/Loader';

export default function(content) {
    describe('Loader', function() {
        it('Simple loader', function () {
            let loader = new ViewLoader();

            loader
                .target(content.element())
                .render()
            ;
            // expect(body.find('.topi-dialog-modal').length).to.be.eql(1);
            // expect(body.find('.topi-dialog-modal').find('.header').length).to.be.eql(1);
            // expect(body.find('.topi-dialog-modal').find('.content').length).to.be.eql(1);

            // body.clean();
        });
    });
};
