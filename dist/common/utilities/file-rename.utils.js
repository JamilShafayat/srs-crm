"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeFileName = void 0;
const path_1 = require("path");
const changeFileName = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = (0, path_1.extname)(file.originalname);
    const randomName1 = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
    const randomName2 = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
    callback(null, `${name}-${randomName1}-${randomName2}${fileExtName}`);
};
exports.changeFileName = changeFileName;
//# sourceMappingURL=file-rename.utils.js.map