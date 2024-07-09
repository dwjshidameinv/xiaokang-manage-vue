import request from "@/utils/request"
import type{ IList } from "./type"
import type { IList2 } from "./type"
import type {IEdit} from "./type"
export class API{
    static list = (params:IList) =>request.get("/menu/list1",{params})
    static category = () =>request.get("/menuManage/categoryNameList")
    // static kindList = (id:Number) =>request.get("menu/kindList")
    static list2 = (data:IList2) =>request.post("/menu/list2",data)
    static edit = (data:IEdit) =>request.post("/menu/edit",data)
    static delete = (id:Number) =>request.get("/menu/delete",{params:{id}})
    static add = (data:IEdit) =>request.post("/menu/add",data)


    // static list2 = (data:IList2) =>request.post("/FoodMenu/GetFoodItemById",data)
    // static add = (data:IEdit) =>request.post("/FoodMenu/AddFoodMenu",data)
    // static edit = (data:IEdit) =>request.post("/FoodMenu/editMenu",data)
    // static delete = (id:Number) =>request.get("/FoodMenu/Delete",{params:{id}})
    // static category = () =>request.get("/FoodMenu/categoryNameList")

    
}