"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("../../../../common/entities/admin/users/user.entity");
const user_type_enum_1 = require("../../../../common/enums/admin/user-type.enum");
const customException_1 = require("../../../../common/exceptions/customException");
const validationException_1 = require("../../../../common/exceptions/validationException");
const mail_service_1 = require("../../../mail/mail.service");
const typeorm_2 = require("typeorm");
let RegistrationService = class RegistrationService {
    constructor(adminUserRepository, connection, mailService) {
        this.adminUserRepository = adminUserRepository;
        this.connection = connection;
        this.mailService = mailService;
    }
    async create(registrationDto) {
        try {
            const { full_name, phone, password } = registrationDto;
            const findExisting = await this.adminUserRepository.findOne({ phone });
            if (findExisting) {
                throw new validationException_1.ValidationException([
                    {
                        field: 'phone',
                        message: 'User Already  Exists.',
                    },
                ]);
            }
            const user_type = user_type_enum_1.UserTypeEnum.GENERAL_USER;
            const hashedPassword = await bcrypt.hash(password, 12);
            const data = {
                full_name,
                phone,
                user_type,
                password: hashedPassword,
            };
            const addedUserData = await this.adminUserRepository.save(data);
            const token = Math.floor(1000 + Math.random() * 9000).toString();
            await this.mailService.sendUserConfirmation(addedUserData, token);
            return addedUserData;
        }
        catch (error) {
            throw new customException_1.CustomException(error);
        }
    }
};
RegistrationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.AdminUserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Connection,
        mail_service_1.MailService])
], RegistrationService);
exports.RegistrationService = RegistrationService;
//# sourceMappingURL=registrations.service.js.map