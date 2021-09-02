import { AdminModuleList } from '../modules/admin/admin.module';
// import { CompanyModule, CompanyModuleList } from '../modules/company/company.module';
// import { PublicModuleList } from '../modules/public/public.module';

const ModuleList = [
  {
    url: '/admin',
    Module: AdminModuleList,
  },
  // {
  //   url: '/company',
  //   Module: CompanyModuleList
  // },
  // {
  //   url: '/public',
  //   Module: PublicModuleList
  // }
];
export default ModuleList;
