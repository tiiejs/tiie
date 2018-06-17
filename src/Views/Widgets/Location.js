import SelectRemote from 'Topi/Views/Widgets/SelectRemote';

import global from "Topi/global";

const cn = 'Location';
class Location extends SelectRemote {
    constructor(params = {}) {
        params.endpoint = global.components.get("@api").endpoint("/offers/locations");

        super(params);
    }
}

export default Location;
