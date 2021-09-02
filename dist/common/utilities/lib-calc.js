"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibCalc = void 0;
class LibCalc {
    static randByMaxMin(max, min = 0.0, type = 'int') {
        if (type === 'int')
            return Math.ceil(Math.random() * (max - min) + min);
        else
            return Math.random() * (max - min) + min;
    }
}
exports.LibCalc = LibCalc;
//# sourceMappingURL=lib-calc.js.map