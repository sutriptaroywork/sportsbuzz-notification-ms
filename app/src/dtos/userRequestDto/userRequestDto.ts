import { GenderType } from "../../../enums/genderType/genderType"
import { IsEmail, IsEnum, IsNumber, IsString, validate } from "class-validator"

export class UserRequestDto {
    @IsString()    
    public name : string
    
    @IsNumber()
    public age: number
    
    @IsEnum(GenderType)
    public gender : GenderType

    @IsString()
    @IsEmail()
    public email : string

}
