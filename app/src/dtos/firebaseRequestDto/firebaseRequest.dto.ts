import { ObjectId } from "mongoose"
import { IsMongoId, IsString, IsOptional, IsEnum } from "class-validator"
import { GenerateLinkType } from "@/enums/firebase/generateLinkType"

export class FirebaseShortUrlRequestDto {
  @IsString()
  @IsEnum(GenerateLinkType)
  public type: GenerateLinkType
  
  @IsString()
  public code: string

  @IsString()
  @IsOptional()
  public sportsType: string

  @IsString()
  @IsMongoId()
  @IsOptional() 
  public id: ObjectId

}