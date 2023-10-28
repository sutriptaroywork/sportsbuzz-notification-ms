
export interface getPaginationValues2Params {
  start?: number;
  limit?: number;
  sort?: string;
  order?: string;
  search?: string;
}

export interface getPaginationValues2Response {
  start: number;
  limit: number;
  sorting: {
    [sort: string]: number;
  };
  search: string;
}