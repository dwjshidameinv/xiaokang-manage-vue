import request from "@/utils/request"
import type{ IList } from "./type"
import type { IList2 } from "./type"
import type {IEdit} from "./type"
export class API{
    static list = (params:IList) =>request.get("/menu/list1",{params})
    static category = () =>request.get("/menuManage/categoryNameList")
    // static kindList = (id:Number) =>request.get("menu/kindList"})
    static list2 = (data:IList2) =>request.post("/menu/list2",data)
    static edit = (data:IEdit) =>request.post("/menu/edit",data)
}