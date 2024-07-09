import request from "@/utils/request"
import type { IList } from "./type"
export class API{
   

    static list = (data:IList) =>request.post("/menuManage/list2",data)
     static category = () =>request.get("/mealMmanage/categoryList")
    // static list2 = (data:IList2) =>request.post("/FoodMenu/GetFoodItemById",data)
    // static add = (data:IEdit) =>request.post("/FoodMenu/AddFoodMenu",data)
    // static edit = (data:IEdit) =>request.post("/FoodMenu/editMenu",data)
    // static delete = (id:Number) =>request.get("/FoodMenu/Delete",{params:{id}})
    // static category = () =>request.get("/FoodMenu/categoryNameList")

    
}