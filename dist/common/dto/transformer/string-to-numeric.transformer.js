"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function StringToNumericTransformer({ value }) {
    if (typeof value === 'number' ||
        (typeof value === 'string' && value.trim().length > 0))
        return Number(value) || NaN;
    return null;
}
exports.default = StringToNumericTransformer;
//# sourceMappingURL=string-to-numeric.transformer.js.map