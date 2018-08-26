export default function boolean(value) {
    if (value == '0') {
        return 0;
    } else {
        if (value) {
            return 1;
        } else {
            return 0;
        }
    }
};
