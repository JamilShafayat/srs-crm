import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestEntity } from 'src/common/entities/admin/test/test.entity';
import { TestsController } from './controllers/test.controllers';
import { TestsService } from './services/test.service';

@Module({
  imports: [TypeOrmModule.forFeature([TestEntity])],
  controllers: [TestsController],
  providers: [TestsService],
})
export class TestsModule {}
