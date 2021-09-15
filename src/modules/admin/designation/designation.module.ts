import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DesignationEntity } from 'src/common/entities/designation.entity';
import { DesignationController } from './controllers/designation.controllers';
import { DesignationService } from './services/designation.service';

@Module({
  imports: [TypeOrmModule.forFeature([DesignationEntity])],
  controllers: [DesignationController],
  providers: [DesignationService],
})
export class DesignationModule {}
