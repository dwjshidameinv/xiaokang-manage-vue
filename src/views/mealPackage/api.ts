import request from "@/utils/request"

export class API{
    
    static list = (data:any) =>request.post("/mealMmanage/list",data)
    static category = () =>request.get("/mealMmanage/listKind")
    static dishList = () =>request.get("/menu/list1")
    // // static kindList = (id:Number) =>request.get("menu/kindList")
    // static list2 = (data:IList2) =>request.post("/menu/list2",data)
    // static edit = (data:IEdit) =>request.post("/menu/edit",data)
    // static delete = (id:Number) =>request.get("/menu/delete",{params:{id}})
    static add = (data:any) =>request.post("/mealMmanage/addMeal",data)
}