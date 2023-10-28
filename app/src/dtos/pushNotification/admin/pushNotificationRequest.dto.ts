import { ObjectId } from "mongoose";
import { IsString, IsEnum, IsMongoId, IsDateString, IsOptional } from "class-validator"
import { NotificationTopicEnum } from "@/enums/notification/notificationTopic.enum"

export class CreatePushNotificationRequestDto {
  @IsString()
  public sTitle: string;

  @IsString()
  public sMessage: string;

  @IsString()
  @IsEnum(NotificationTopicEnum)
  public sTopic: NotificationTopicEnum;

  @IsDateString()
  @IsOptional()
  public dExpTime: Date;
}

export class UpdatePushNotificationRequestParamsDto {
  @IsString()
  @IsMongoId()    
  public id: ObjectId
}
export class UpdatePushNotificationRequestDto {
  @IsString()
  public sTitle: string;

  @IsString()
  public sMessage: string;

  @IsString()
  @IsEnum(NotificationTopicEnum)
  public sTopic: NotificationTopicEnum;

  @IsDateString()
  @IsOptional()
  public dExpTime: Date;
}

export class DeletePushNotificationRequestParamsDto {
  @IsString()
  @IsMongoId()    
  public id: ObjectId
}

export class GetPushNotificationRequestParamsDto {
  @IsString()
  @IsMongoId()    
  public id: ObjectId
}