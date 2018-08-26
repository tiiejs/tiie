import Alert from 'Topi/Dialog/Views/Alert';

export default function(body) {
    describe('Dialog alert', function() {
        it('Simple alert', function () {
            let alert = new Alert(),
                expected = 2
            ;

            alert
                .target(body.element())
                .set('title', 'New offer')
                .set('content', 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.')
                .set('buttons', [{
                    id : 'confirm',
                    label : 'Confirm',
                    type : 'success',
                }, {
                    id : 'close',
                    label : 'Close',
                    type : 'danger',
                }])
                .render()
            ;

            expect(body.find('.topi-dialog-alert').length).to.be.eql(1);
            expect(body.find('.topi-dialog-alert').find('button').length).to.be.eql(2);

            alert.on('button.confirm', () => {
                expected--;
            });

            alert.on('button.close', () => {
                expected--;
            });

            body.find('.topi-dialog-alert').find('button.--success').click();
            body.find('.topi-dialog-alert').find('button.--danger').click();

            expect(expected).to.be.eql(0);
        });
    });
};
