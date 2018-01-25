import {Injectable} from '@angular/core';

@Injectable()
export class HelperService {

  constructor() {
  }

  parseToFix(input: number, num): number {
    return parseFloat(parseFloat((Math.round(input * 10000) / 10000).toString()).toFixed(num));
  }

  generateQueryString(o: any) {
    let str = '';
    if (o) {
      Object.keys(o).forEach(key => {
        console.log(key);
        if (o[key] !== null && o[key] !== '' && o[key] !== undefined) {
          str = str +  '&f_' + key + '=' +  o[key]
        }
      });
    }

    return str;
  }

}
