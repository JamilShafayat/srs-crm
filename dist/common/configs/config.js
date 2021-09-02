"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMPANY_JWT_SECRET = exports.ADMIN_JWT_SECRET = void 0;
exports.ADMIN_JWT_SECRET = process.env.JWT_SECRET || 'Simec-System@123456?';
exports.COMPANY_JWT_SECRET = process.env.COMPANY_JWT_SECRET || 'Simec-System-Company@123456?';
//# sourceMappingURL=config.js.map