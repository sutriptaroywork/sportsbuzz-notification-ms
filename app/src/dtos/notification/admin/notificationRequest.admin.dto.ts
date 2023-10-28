import { ObjectId } from "mongoose"
import { IsMongoId, IsString, IsDateString, IsInt, IsOptional } from "class-validator"

export class AddNotificationAdminRequestDto {
  @IsString()
  @IsMongoId()    
  public iUserId: ObjectId
  
  @IsString()
  public sTitle: string
  
  @IsString()
  public sMessage: string

  @IsString()
  @IsMongoId()    
  public iType: ObjectId
}

export class AddNotificationAdminTimedRequestDto {
  @IsString()
  public sTitle: string
  
  @IsString()
  public sMessage: string

  @IsString()
  @IsMongoId()    
  public iType: ObjectId

  @IsDateString()
  public dExpTime: Date
}

export class UpdateNotificationAdminRequestDto {
  @IsString()
  public sTitle: string
  
  @IsString()
  public sMessage: string

  @IsString()
  @IsMongoId()    
  public iType: ObjectId

  @IsString()
  @IsMongoId() 
  @IsOptional()
  public aReadIds: ObjectId[]

  @IsInt()
  @IsOptional()
  public eStatus: number

  @IsDateString()
  public dExpTime: Date
}

export class UpdateNotificationAdminRequestParamsDto {
  @IsString()
  @IsMongoId()    
  public id: ObjectId
}

export class ListNotificationV2RequestQueryDto {
  @IsString()
  @IsMongoId()
  @IsOptional()
  public iType: ObjectId

  @IsDateString()
  @IsOptional()
  public dDateFrom: Date

  @IsDateString()
  @IsOptional()
  public dDateTo: Date

  @IsInt()
  @IsOptional()
  public nStart: number

  @IsInt()
  @IsOptional()
  public nLimit: number

  @IsString()
  @IsOptional()
  public sSorting: string

  @IsString()
  @IsOptional()
  public sSearch: string
}

export class GetNotificationV2RequestQueryDto {
  @IsString()
  @IsMongoId()    
  public id: ObjectId
}

export class NotificationIdDto {
  @IsString()
  @IsMongoId()    
  public id: ObjectId
}

export class ListPushNotificationRequestQueryDto {
  @IsDateString()
  @IsOptional()
  public dateFrom: Date

  @IsDateString()
  @IsOptional()
  public dateTo: Date

  @IsString()
  @IsOptional()
  public platform: string

  @IsInt()
  @IsOptional()
  public start: number

  @IsInt()
  @IsOptional()
  public limit: number

  @IsString()
  @IsOptional()
  public sort: string

  @IsString()
  @IsOptional()
  public search: string
}