import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AdminUserEntity } from 'src/common/entities/admin/users/user.entity';
import { UserTypeEnum } from 'src/common/enums/admin/user-type.enum';
import { CustomException } from 'src/common/exceptions/customException';
import { ValidationException } from 'src/common/exceptions/validationException';
import { MailService } from 'src/modules/mail/mail.service';
import { Connection, Repository } from 'typeorm';
import { RegistrationDto } from '../dto/registrations.dto';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(AdminUserEntity)
    private readonly adminUserRepository: Repository<AdminUserEntity>,
    private connection: Connection,
    private mailService: MailService,
  ) {}

  async create(registrationDto: RegistrationDto) {
    try {
      const { full_name, phone, password } = registrationDto;

      //find Existing Entry
      const findExisting = await this.adminUserRepository.findOne({ phone });

      // Entry if found
      if (findExisting) {
        // throw an exception
        throw new ValidationException([
          {
            field: 'phone',
            message: 'User Already  Exists.',
          },
        ]);
      }

      const user_type = UserTypeEnum.GENERAL_USER;

      //Data store
      const hashedPassword = await bcrypt.hash(password, 12);
      const data = {
        full_name,
        phone,
        user_type,
        password: hashedPassword,
      };

      const addedUserData = await this.adminUserRepository.save(data);
      // send confirmation mail

      const token = Math.floor(1000 + Math.random() * 9000).toString();
      await this.mailService.sendUserConfirmation(addedUserData, token);

      // Created Data Return
      return addedUserData;
    } catch (error) {
      throw new CustomException(error);
    }
  }
}
