import { IDepartment } from "./app-interface";
import { IPaging } from "./paging-interface";

export interface IResponseDepartment{
  departments:IDepartment[]
  pagingInfo:IPaging

}
