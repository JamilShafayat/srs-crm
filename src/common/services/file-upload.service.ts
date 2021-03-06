import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as mv from 'mv';
import { RedisService } from 'nestjs-redis';

/**
 * @class FileUploadService
 * @author asraful
 * @version 0.0.2
 * @since 0.0.2
 * @description FileUploadService use for file store from temp to main space
 */
@Injectable()
export class FileUploadService {
	constructor(private readonly redisService: RedisService) { }

	/**
	 * @param {string} url
	 */
	private async IsFileExists(url: string): Promise<string> {
		if (url) {
			const imagePath = url.split(process.env.HOST_URL);
			if (imagePath.length !== 2) {
				return undefined;
			}

			const path = await this.urlToPath(url);
			if (!path) {
				return undefined;
			}

			const isFile: boolean = await fs.existsSync(path + '');
			if (isFile === true) {
				return path.valueOf();
			}
		}
		return undefined;
	}

	/**
	 * @param {string} url - url for image
	 */
	private async urlToPath(url: string): Promise<string> {
		const imagePath = url.split(process.env.HOST_URL);
		
		if (imagePath.length !== 2) {
			return undefined;
		}

		const path = process.env.DIR + '' + imagePath[1];
		return path;
	}

	/**
	 * @param {String} token - session token
	 * @param {String} url - url from image
	 * @param {String} path - where to save
	 * @param {String} name - file name
	 */
	async FileCopy(
		token: string,
		url: string,
		path: string,
		name: string,
	): Promise<string> {
		const filePath = await this.IsFileExists(url);

		if (filePath) {
			const fileExistence: string[] = filePath.split('.');
			const pathImage: string =
				process.env.DIR +
				'/assets/' +
				path +
				'/' +
				name +
				'.' +
				(fileExistence.length === 2 ? fileExistence[1] : '');

			const urlImage: string =
				process.env.HOST_URL +
				'/assets/' +
				path +
				'/' +
				name +
				'.' +
				(fileExistence.length === 2 ? fileExistence[1] : '');

			try {
				await fs.mkdirSync(process.env.DIR + '/assets/' + path + '/', {
					recursive: true,
				});

				if (filePath + '' !== '' + pathImage)
					await fs.copyFileSync(filePath + '', '' + pathImage);

				const imagePaths: string[] = await this.redisService
					.getClient('REDIS_TMP_FILE')
					.lrange(token + '', 0, -1);

				for (let i = 0; i < imagePaths.length; i++) {
					if (imagePaths[i] + '' === filePath + '') {
						await this.redisService
							.getClient('REDIS_TMP_FILE')
							.lrem(token + '', -1, imagePaths[i] + '');
						break;
					}
				}

				return urlImage;
			} catch (error) {
				console.log(error);
				return undefined;
			}
		}

		return undefined;
	}

	/**
	 * @function arrImagesCopy - copy images
	 * @author asraful
	 * @version 0.0.2
	 * @since 0.0.2
	 * @param {String} token - session token
	 * @param {string p[]} currUrls - multiple image
	 * @param {string p[]} newUrls - multiple image
	 * @param {String} url - url from image
	 * @param {String} path - where to save
	 * @param {String} name - file name
	 * @returns {Promise<string[]>} - copy images
	 */
	async arrImagesCopy(
		token: string,
		currUrls: string[],
		newUrls: string[],
		path: string,
		name: string,
	): Promise<string[]> {
		try {
			const tmpFile: string[] = currUrls;
			for (let i = 0; i < newUrls.length; i++) {
				if (currUrls[i] + '' === '' + newUrls[i]) {
					continue;
				} else if (newUrls[i]) {
					const filepath = await this.FileCopy(
						token,
						newUrls[i],
						path,
						`${name}${i}`,
					);
					tmpFile[i] = filepath ? filepath : tmpFile[i];
				} else {
					tmpFile[i] = null;
				}
			}

			newUrls = tmpFile.filter(function (el) {
				return el != null;
			});

			if (newUrls.length === 0) {
				newUrls = [];
			}

			return newUrls;
		} catch (error) {
			console.log(error);
			return currUrls;
		}
	}

	IsExistsTempFile = (fileName: string) => {
		const folder = fileName.split('.').slice(0, -1).join('.');
		try {
			if (!folder) return false;
			if (!fs.existsSync(process.env.TEMP_FILES_DIR + '/' + folder)) return false

			return true;
		} catch (err) {
			return false;
		}
	}

	moveTempFile = (fileName: string) => {
		const folder = fileName.split('.').slice(0, -1).join('.');
		try {
			if (folder) {
				if (fs.existsSync(process.env.TEMP_FILES_DIR + '/' + folder)) {
					mv(
						process.env.TEMP_FILES_DIR + '/' + folder,
						process.env.FILES_DIR + '/' + folder,
						{ mkdirp: true },
					);

					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		} catch (err) {
			return false;
		}
	};
}
