import { GenderType } from "../../../enums/genderType/genderType"
import { UserModelOutput } from "../../../models/userModel/userModel"
import { ObjectId } from "mongoose"

export default class UserResponseDto {  
    public _id : ObjectId
    public name : string
    public age: number
    public gender : GenderType
    public email : string

    public createdAt? : Date
    public updatedAt? : Date

    public static toResponse = (data : UserModelOutput) => {
        return data;
        // return {
        //     _id  : data._id,
        //     email : data.email,
        //     name : data.name,
        //     age : data.age,
        //     gender : data.gender,
        //     createdAt : data.createdAt,
        //     updatedAt : data.updatedAt
        // }
    }
}