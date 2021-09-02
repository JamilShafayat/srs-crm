import { AdminUserDto } from 'src/common/dto/admin-user.dto';
import { PaginationDto } from 'src/common/dto/Pagination.dto';
import { TestEntity } from 'src/common/entities/admin/test/test.entity';
import { Connection, Repository } from 'typeorm';
import { CreateTestDto } from '../dto/create-test.dto';
import { StatusChangeTestDto } from '../dto/status-change-test.dto';
import { TestListDto } from '../dto/test-list.dto';
import { UpdateTestDto } from '../dto/update-test-dto';
export declare class TestsService {
    private readonly testRepository;
    private connection;
    constructor(testRepository: Repository<TestEntity>, connection: Connection);
    findAll(filter: TestListDto, pagination: PaginationDto): Promise<[TestEntity[], number]>;
    create(createTestDto: CreateTestDto, test: AdminUserDto): Promise<{
        name: string;
        type: string;
        created_by: string;
    } & TestEntity>;
    findAllList(): Promise<[TestEntity[], number]>;
    findOne(id: string): Promise<TestEntity>;
    update(id: string, updateTestDto: UpdateTestDto, test: AdminUserDto): Promise<TestEntity>;
    status(id: string, statusChangeTestDto: StatusChangeTestDto, adminUser: AdminUserDto): Promise<TestEntity>;
    remove(id: string, adminUser: AdminUserDto): Promise<void>;
    finalDelete(id: string): Promise<boolean>;
}
