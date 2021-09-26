import { AdminModuleList } from '../modules/admin/admin.module';
import { PublicModuleList } from '../modules/public/public.module';

const ModuleList = [
	{
		url: '/admin',
		Module: AdminModuleList,
	},
	{
		url: '/public',
		Module: PublicModuleList
	}
];

export default ModuleList;
