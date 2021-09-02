export declare class PaginationDto {
    readonly page: number;
    readonly limit: number;
    readonly skip: number;
    constructor(obj: {
        page?: string | number;
        limit: string | number;
    });
}
