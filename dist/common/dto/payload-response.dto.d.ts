export declare class IMetadata {
    readonly page: number;
    readonly totalCount: number;
    readonly totalPage?: number;
    readonly limit: number;
}
export declare class MetadataDTO extends IMetadata {
    readonly page: number;
    readonly totalCount: number;
    readonly limit: number;
    constructor(page: number, totalCount: number, limit: number);
}
export declare class PayloadDTO {
    readonly list: any[];
    readonly details: any;
    constructor(list: any[], details: any);
}
export declare class PayloadResponseDTO {
    private response;
    statusCode: number;
    message?: string;
    metadata?: IMetadata;
    data?: any;
    constructor(response: {
        statusCode: number;
        message?: string;
        metadata?: IMetadata;
        data?: any;
    });
}
