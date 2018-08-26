import Modal from 'Topi/Dialog/Views/Modal';
import View from 'Topi/View';

export default function(body) {
    describe('Modal', function() {
        it('Simple modal', function () {
            let form = new View(`
                <h1 class="header">Contacts form</h1>
                <p class="content">
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
                    sed diam nonumy eirmod tempor invidunt ut labore et dolore
                    magna aliquyam erat, sed diam voluptua. At vero eos et
                    accusam et justo duo dolores et ea rebum. Stet clita kasd
                    gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                    diam nonumy eirmod tempor invidunt ut labore et dolore magna
                    aliquyam erat, sed diam voluptua. At vero eos et accusam et justo
                    duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
                    sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet,
                    consetetur sadipscing elitr, sed diam nonumy eirmod tempor
                    invidunt ut labore et dolore magna aliquyam erat, sed diam
                    voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
                    Stet clita kasd gubergren, no sea takimata sanctus est Lorem
                    ipsum dolor sit amet.
                </p>
            `);

            let modal = new Modal(form);

            modal
                .target(body.element())
                .render()
            ;

            expect(body.find('.topi-dialog-modal').length).to.be.eql(1);
            expect(body.find('.topi-dialog-modal').find('.header').length).to.be.eql(1);
            expect(body.find('.topi-dialog-modal').find('.content').length).to.be.eql(1);

            body.clean();
        });
    });
};
