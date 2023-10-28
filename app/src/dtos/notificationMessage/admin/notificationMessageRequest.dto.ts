import { ObjectId } from "mongoose";
import { IsString, IsEnum, IsMongoId, IsDateString, IsOptional, IsBoolean } from "class-validator";
import { NotificationPlatform } from "@/enums/notification/notificationPlatform.enum";
import { NotificationMessageKeys } from "@/enums/notification/notificationMessageKeys.enum";

export class UpdatePushNotificationMessageRequestDto {

  @IsString()
  @IsEnum(NotificationMessageKeys)
  public eKey: string;

  @IsString()
  public sHeading: string;

  @IsString()
  public sDescription: string;

  @IsString()
  @IsEnum(NotificationPlatform)
  public ePlatform: NotificationPlatform;

  @IsBoolean()
  public bEnableNotifications: boolean;
}

export class UpdatePushNotificationMessageParamsRequestDto {
  @IsString()
  @IsMongoId()
  public id: ObjectId;
}

export class GetPushNotificationMessageParamsRequestDto {
  @IsString()
  @IsMongoId()
  public id: ObjectId;
}