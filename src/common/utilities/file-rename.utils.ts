import { extname } from 'path';

export const changeFileName = (file, callback) => {
	const name = file.originalName.split('.')[0];
	const fileExtName = extname(file.originalName);
	
	const randomName1 = Array(4)
		.fill(null)
		.map(() => Math.round(Math.random() * 16).toString(16))
		.join('');

	const randomName2 = Array(4)
		.fill(null)
		.map(() => Math.round(Math.random() * 16).toString(16))
		.join('');

	callback(null, `${name}-${randomName1}-${randomName2}${fileExtName}`);
};
