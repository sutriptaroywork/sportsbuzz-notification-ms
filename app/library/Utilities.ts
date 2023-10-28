import { getPaginationValues2Params, getPaginationValues2Response } from "@/interfaces/utilities/utilities.interface";

export default class Utilities {
  constructor() {
    // write constructor
  }

  static defaultSearch = (val: string) => {
    let search: string = '';
    if (val) {
      search = val.replace(/\\/g, '\\\\')
        .replace(/\$/g, '\\$')
        .replace(/\*/g, '\\*')
        .replace(/\+/g, '\\+')
        .replace(/\[/g, '\\[')
        .replace(/\]/g, '\\]')
        .replace(/\)/g, '\\)')
        .replace(/\(/g, '\\(')
        .replace(/'/g, '\\\'')
        .replace(/"/g, '\\"')
    }
    return search;
  }

  static getPaginationValues2 = ({ start = 0, limit = 10, sort = 'dCreatedAt', order, search }: getPaginationValues2Params): getPaginationValues2Response => {
    const orderBy = order && order === 'asc' ? 1 : -1;
    const sorting = {
      [sort]: orderBy
    }
  
    if(search) {
      search = Utilities.defaultSearch(search);
    }
  
    return {
      start,
      limit,
      sorting,
      search
    };
  }
}