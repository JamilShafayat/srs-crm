import { RedisService } from 'nestjs-redis';
export declare class FileUploadService {
    private readonly redisService;
    constructor(redisService: RedisService);
    private IsFileExists;
    private urlToPath;
    FileCopy(token: string, url: string, path: string, name: string): Promise<string>;
    arrImagesCopy(token: string, currUrls: string[], newUrls: string[], path: string, name: string): Promise<string[]>;
    IsExistsTempFile: (fileName: string) => boolean;
    moveTempFile: (fileName: string) => boolean;
}
