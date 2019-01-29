import Modal from 'Topi/Dialog/Views/Modal';

import View from 'Topi/View';
import Date from 'Topi/Views/Widgets/Date';

export default function(content) {
    describe('Views.Widgets.Date', function() {
        it('Change date', function (done) {
            let expected = 0;

            let widget = new Date({
                value : '2018-01-01'
            });

            widget
                .target(content.element())
                .render()
            ;

            widget.element().trigger('focusin');

            setTimeout(function() {
                content.body().find('[data-date="5"]').click();
            }, 1000);

            widget.on('value', (event, params = {}) => {
                expect(event.name).to.be.eql("value:change");
                expect(params.previous).to.be.equal('2018-01-01');
                expect(event.this.get('value')).to.be.equal('2018-01-05');

                done();

                content.clean();
            });
        });

        it('State error', function (done) {
            let expected = 0;

            let widget = new Date({
                value : '2018-01-01'
            });

            widget
                .target(content.element())
                .render()
            ;

            widget.set('state', {
                type : 'error',
            });

            setTimeout(function() {
                expect(widget.element().hasClass('--error')).to.be.eql(true);

                widget.element().trigger('focusin');
                expect(widget.element().hasClass('--error')).to.be.eql(false);

                widget.element().trigger('focusout');
                expect(widget.element().hasClass('--error')).to.be.eql(true);

                done();
            }, 1000);


            // setTimeout(function() {
            //     content.body().find('[data-date="5"]').click();
            // }, 1000);

            // widget.on('value', (event, params = {}) => {
            //     expect(event.name).to.be.eql("value:change");
            //     expect(params.previous).to.be.equal('2018-01-01');
            //     expect(event.this.get('value')).to.be.equal('2018-01-05');

            //     done();
            // });
        });
    });
};
