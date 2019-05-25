import TiieObject from "Tiie/Object";

const cn = "List";
class List extends TiieObject {
    constructor(items = []) {
        super();

        let p = this.__private(cn, {
            items,
        });
    }

    sort(rules = []) {
        let p = this.__private(cn);

        rules = rules.map((rule) => {
            let splited = rule.split(" ");

            return {
                field : splited[0].trim(),
                type : (splited[1] !== undefined) ? splited[1].trim() : "asc",
                method : (splited[2] !== undefined) ? splited[2].trim() : "simple",
            };
        });

        p.items.sort((a, b) => {
            for(let key=0; key < rules.length; key++) {
                let rule = rules[key];

                if(a[rule.field] == b[rule.field]) {
                    continue;
                }

                if(rule.type == "asc") {
                    if(rule.method == "locale") {
                        return a[rule.field].localeCompare(b[rule.field]);
                    } else {
                        if(a[rule.field] > b[rule.field]) {
                            return 1;
                        } else if(a[rule.field] < b[rule.field]) {
                            return -1;
                        }
                    }
                } else if(rule.type == "desc") {
                    if(rule.method == "locale") {
                        return -1 * (a[rule.field].localeCompare(b[rule.field]));
                    } else {
                        if(a[rule.field] > b[rule.field]) {
                            return -1;
                        } else if(a[rule.field] < b[rule.field]) {
                            return 1;
                        }
                    }
                }
            }

            return 0;
        });
    }

    toArray() {
        let p = this.__private(cn);

        return p.items;
    }
};

export default List;
