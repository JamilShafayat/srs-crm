/**
 * @description base DTO
 * @author Md Shah Alam Shamim
 * @version 0.0.2
 * @since 0.0.2
 */
export default abstract class BaseDTO {
  id: number;
  isActive: boolean;
  isDelete: boolean;

  createBy: number | null;
  createAt: Date | null;

  updateBy: number | null;
  updateAt: Date | null;
}
