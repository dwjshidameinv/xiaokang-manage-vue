export interface IList{
    pageNum:number,
    limit:number
}
export interface IMenu{
    foodId?:number,
    foodName?:String,
    foodImg?:String,
    foodSale?:String,
    foodState?:number,
    foodAot?:any,
    foodKindId?:number,
    kindName?:String,
    setMenu?:Number
}
export interface IList2{
    pageNum:number,
    limit:number,
    name?:String,
    stateId?:Number,
    categoryId?:Number
}
export interface IEdit{
    foodId:Number,
    foodName?:String,
    foodSale?:Number,
    foodImg?:String,
    foodKindId?:Number

}
