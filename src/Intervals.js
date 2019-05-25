/** @module Tiie */
import TiieObject from 'Tiie/Object';

const cn = 'Intervals';

/**
 * @class
 */
class Intervals extends TiieObject {
    constructor() {
        super();

        let p = this.__private(cn, {
            intervals : {
                "controller" : [],
                "action" : [],
            }
        });
    }

    /**
     * Register new interval at given scope.
     *
     * @param {string} scope
     * @param {function} handler
     * @param {number} time
     *
     * @return {number} Number of create interval.
     */
    register(scope, handler, time = 1000) {
        let p = this.__private(cn);

        if(p.intervals[scope] === undefined) {
            this.__log(`Unsuported type of scopee '${scope}' for interval.`, "warn", "Tiie.Intervals");

            return null;
        }

        let interval = setInterval(handler, time);

        p.intervals[scope].push(interval);

        return interval;
    }

    /**
     * Clean all intervals at given scope.
     *
     * @param {string} scope
     *
     * @return {undefined}
     */
    clean(scope) {
        let p = this.__private(cn);

        if(p.intervals[scope] === undefined) {
            this.__log(`Unsuported type of scopee '${scope}' for interval.`, "warn", "Tiie.Intervals");

            return;
        }

        p.intervals[scope].forEach((intervalId) => {
            clearInterval(intervalId);
        });

        p.intervals[scope] = [];

        return;
    }
}

Intervals.SCOPE_CONTROLLER = "controller";
Intervals.SCOPE_ACTION = "action";

export default Intervals;
