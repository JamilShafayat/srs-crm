declare const ModuleList: {
    url: string;
    Module: typeof import("../modules/admin/users/users.module").UsersModule[];
}[];
export default ModuleList;
