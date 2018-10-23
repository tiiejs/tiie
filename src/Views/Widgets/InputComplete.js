import Widget from 'Topi/Views/Widgets/Widget';

const cn = 'InputComplete';

class InputComplete extends Widget {
    constructor(params = {}) {
        super(`<input type="text" class="topi-input">`, params);

        const p = this.private(cn, {
            urn : params.urn === undefined ? null : params.urn,
            source : params.source === undefined ? null : params.source,
            api : params.api === undefined ? null : params.api,
        });

        this.set('-value', params.value === undefined ? null : params.value);

        if (p.source == null) {
            p.source = (term, suggest) => {
                p.api.request((request) => {
                    request.urn(`${p.urn}/${term}`);
                }).promise().then((response) => {
                    suggest(response.data('hints'));
                });
            }
        }

        this.on([
            'value',
        ], () => {
            this.reload();
        }, this.id());

        setInterval(() => {
            let value = this.element().val();

            if (value == "") {
                this.set('value', null, {ommit : this.id});
            }else{
                this.set('value', value, {ommit : this.id});
            }
        }, 1000);

        // Prepare
        this.element().autoComplete({
            minChars: 2,
            source: p.source,
            // renderItem: (item, search) => {
            //     search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            //     var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
            //     return '<div class="autocomplete-suggestion" data-langname="'+item[0]+'" data-lang="'+item[1]+'" data-val="'+search+'"><img src="img/'+item[1]+'.png"> '+item[0].replace(re, "<b>$1</b>")+'</div>';
            // },
            // onSelect: (e, term, item) => {
            //     if (term == "") {
            //         this.set('value', null, {ommit : this.id});
            //     }else{
            //         this.set('value', term, {ommit : this.id});
            //     }
            // }
        });
    }
}

export default InputComplete;
