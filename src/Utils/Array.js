class UtilsArray {
    path(items, from, to, valueKey = 'id', parentKey = 'parentId') {
        const path = [];

        let pointer = items.find(item => item[valueKey] == from);

        if (pointer == undefined) {
            return null;
        }

        path.push(pointer);

        while(pointer[parentKey] != to) {
            pointer = items.find(item => item[valueKey] == pointer[parentKey]);

            if (pointer == undefined) {
                return null;
            }else{
                path.push(pointer);
            }
        }

        if (to != null) {
            pointer = items.find(item => item[valueKey] == to);

            if (pointer == undefined) {
                return null;
            }else{
                path.push(pointer);
            }
        }

        return path;
    }

    splitToRows(items, atRow) {
        let rows = [],
            row = []
        ;

        items.forEach((item) => {
            row.push(item);

            if (row.length == atRow) {
                rows.push(row);
                row = [];
            }
        });

        if (row.length > 0) {
            rows.push(row);
        }

        return rows;
    };
};

export default UtilsArray;
