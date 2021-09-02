import { AdminUserDto } from 'src/common/dto/admin-user.dto';
import { PaginationDto } from 'src/common/dto/Pagination.dto';
import { PayloadResponseDTO } from 'src/common/dto/payload-response.dto';
import { EntityManager } from 'typeorm';
import { CreateTestDto } from '../dto/create-test.dto';
import { StatusChangeTestDto } from '../dto/status-change-test.dto';
import { TestIdParamDto } from '../dto/test-id-param.dto';
import { TestListDto } from '../dto/test-list.dto';
import { UpdateTestDto } from '../dto/update-test-dto';
import { TestsService } from '../services/test.service';
export declare class TestsController {
    private readonly testService;
    constructor(testService: TestsService);
    findAll(filter: TestListDto, pagination: PaginationDto): Promise<PayloadResponseDTO>;
    create(adminUser: AdminUserDto, createTestDto: CreateTestDto, manager: EntityManager): Promise<PayloadResponseDTO>;
    findAllList(): Promise<PayloadResponseDTO>;
    findOne(params: TestIdParamDto): Promise<PayloadResponseDTO>;
    update(adminUser: AdminUserDto, params: TestIdParamDto, updateTestDto: UpdateTestDto): Promise<PayloadResponseDTO>;
    status(adminUser: AdminUserDto, params: TestIdParamDto, statusChangeTestDto: StatusChangeTestDto): Promise<PayloadResponseDTO>;
    remove(adminUser: AdminUserDto, params: TestIdParamDto): Promise<PayloadResponseDTO>;
    finalDelete(params: TestIdParamDto): Promise<PayloadResponseDTO>;
}
