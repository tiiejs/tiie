import LoaderManager from 'Topi/Views/Components/Loader/Manager';

export default function(content) {
    describe('Views.Components.Loader.Manager', function() {
        it('Full target loader', function (done) {
            let expected = 0;

            content.element().html(`
                <p>
                    <table>
                        <tr >
                            <td>1</td>
                            <td >Lorem</td>
                        </tr>
                        <tr></tr>
                    </table>
                </p>

            `);

            // let loader = new LoaderManager(content.element());
            let loader = new LoaderManager(content.find('#test-test'));
            let handler = loader.show();


            setTimeout(function() {
                handler.remove()
            }, 5000);

            done();
        });
    });
};
