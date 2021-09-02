export default abstract class BaseDTO {
    id: number;
    isActive: boolean;
    isDelete: boolean;
    createBy: number | null;
    createAt: Date | null;
    updateBy: number | null;
    updateAt: Date | null;
}
