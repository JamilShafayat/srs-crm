import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { changeFileName } from 'src/common/utilities/file-rename.utils';
import { imageFileFilter } from 'src/common/utilities/file-upload-type.utils';
import { PayloadResponseDTO } from '../../common/dto/payload-response.dto';

@Controller('v1/file')
export class FileUploadController {
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file_name', {
      storage: diskStorage({
        destination: './uploads',
        filename: changeFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  uploadSingleFileWithPost(@UploadedFile() file, @Body() body) {
    console.log(file);
    const response = file.filename;
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: '',
      data: { file_name: response },
    });
  }

  @Get(':imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: './files' });
  }
}
