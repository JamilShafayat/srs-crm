import { PayloadResponseDTO } from '../../common/dto/payload-response.dto';
export declare class FileUploadController {
    uploadSingleFileWithPost(file: any, body: any): PayloadResponseDTO;
    seeUploadedFile(image: any, res: any): any;
}
