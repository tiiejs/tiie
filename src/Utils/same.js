/**
 * Check if two object are same.
 */
function same(p1, p2) {
    if (p1 === null || p1 === undefined || p2 === null || p2 === undefined) {
        if (p1 === p2) {
            return true;
        }else{
            return false;
        }
    }

    if (typeof p1 != 'object' || typeof p2 != 'object') {
        if (p1 == p2) {
            return true;
        }else{
            return false;
        }
    }

    let i;

    if(Array.isArray(p1) && Array.isArray(p2)) {
        if (p1.length != p2.length) {
            return false;
        }

        for (i in p1) {
            if (!same(p1[i], p2[i])) {
                return false;
            }
        }
    }else{
        if (!same(Object.keys(p1), Object.keys(p2))) {
            return false
        }

        for (i in p1) {
            if (!same(p1[i], p2[i])) {
                return false;
            }
        }
    }

    return true;
}

export default same;
