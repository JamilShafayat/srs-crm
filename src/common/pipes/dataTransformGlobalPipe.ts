import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class DataTransformGlobalPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    try {
      if (typeof value !== 'object' || Array.isArray(value)) {
        console.log('please provide json data');
      }

      return this.objectTrim(value);
    } catch (err) {}
  }

  arrayTrim(items) {
    for (const item in items) {
      this.trimSubItem(items, item);
    }

    return items;
  }

  objectTrim(obj) {
    Object.keys(obj).forEach((ele) => {
      this.trimSubItem(obj, ele);
    });
		
    return obj;
  }
	
  trimSubItem(obj, ele) {
    if (typeof obj[ele] === 'string') {
      obj[ele] = obj[ele].trim();
    } else if (Array.isArray(obj[ele])) {
      obj[ele] = this.arrayTrim(obj[ele]);
    } else if (typeof obj[ele] === 'object') {
      obj[ele] = this.objectTrim(obj[ele]);
    }
  }
}
