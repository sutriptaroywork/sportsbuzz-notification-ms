
import { ObjectId } from "mongoose"
import { IsMongoId, IsString, IsOptional, IsNumber, IsArray } from "class-validator"

export class ListUserNotificationRequestDto {
  @IsNumber()
  @IsOptional()
  public nLimit: number

  @IsNumber()
  @IsOptional()
  public nSkip: number

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  public aFilters: ObjectId[]
}