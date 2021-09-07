import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplaintEntity } from 'src/common/entities/complaint.entity';
import { ComplaintController } from './controllers/complaint.controller';
import { ComplaintService } from './services/complaint.service';

@Module({
  imports: [TypeOrmModule.forFeature([ComplaintEntity])],
  controllers: [ComplaintController],
  providers: [ComplaintService],
})
export class ComplaintModule {}
