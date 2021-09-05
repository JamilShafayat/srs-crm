declare const ModuleList: {
    url: string;
    Module: typeof import("../modules/admin/auth/auth.module").AdminAuthModule[];
}[];
export default ModuleList;
