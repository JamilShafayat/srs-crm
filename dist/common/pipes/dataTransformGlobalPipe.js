"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataTransformGlobalPipe = void 0;
const common_1 = require("@nestjs/common");
let DataTransformGlobalPipe = class DataTransformGlobalPipe {
    async transform(value, metadata) {
        try {
            if (typeof value !== 'object' || Array.isArray(value)) {
                console.log('please provide json data');
            }
            return this.objectTrim(value);
        }
        catch (err) { }
    }
    arrayTrim(items) {
        for (const item in items) {
            this.trimSubItem(items, item);
        }
        return items;
    }
    objectTrim(obj) {
        Object.keys(obj).forEach((ele) => {
            this.trimSubItem(obj, ele);
        });
        return obj;
    }
    trimSubItem(obj, ele) {
        if (typeof obj[ele] === 'string') {
            obj[ele] = obj[ele].trim();
        }
        else if (Array.isArray(obj[ele])) {
            obj[ele] = this.arrayTrim(obj[ele]);
        }
        else if (typeof obj[ele] === 'object') {
            obj[ele] = this.objectTrim(obj[ele]);
        }
    }
};
DataTransformGlobalPipe = __decorate([
    (0, common_1.Injectable)()
], DataTransformGlobalPipe);
exports.DataTransformGlobalPipe = DataTransformGlobalPipe;
//# sourceMappingURL=dataTransformGlobalPipe.js.map