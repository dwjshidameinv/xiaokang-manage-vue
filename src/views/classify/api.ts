import request from "@/utils/request"
import type { IList } from "./type"
export class API {


    static list = (data: IList) => request.post("/menuManage/list", data)
    static category = () => request.get("/mealMmanage/categoryList")
    static add = (data: any) => request.post("/menuManage/add", data)
    static edit = (data:any) =>request.post("/menuManage/edit",data)
    static delete = (id: Number) => request.get("/menuManage/delete", { params: { id } })
  


}