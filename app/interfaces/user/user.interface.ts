import { PlatformTypesEnums } from '@/enums/platformTypesEnums/platformTypesEnums';
import { SocialMediaTypesEnums } from '@/enums/socialMediaTypesEnums/socialMediaTypesEnums';
import { KYC_STATUS, KYC_VERIFIED_BY } from '@/enums/statusTypeEnums/statusTypeEnums';
import { UserGenderEnums } from '@/enums/userGenderEnums/userGenderEnums';
import { UserStatusEnums } from '@/enums/userStatusEnums/userStatusEnums';
import { UserTypeEnums } from '@/enums/userTypeEnums/userTypeEnums';
import { ObjectId } from 'mongoose';

export interface UserAttributes {
  _id: ObjectId;
  sName: string;
  sUsername: string;
  sEmail: string;
  bIsEmailVerified: boolean;
  sMobNum: string;
  sPassword: string;
  bIsMobVerified: boolean;
  sProPic: string;
  eType: UserTypeEnums;
  eGender: UserGenderEnums;
  aJwtTokens: [
    {
      sToken: string;
      sPushToken: string;
      dTimeStamp: Date;
    }
  ];
  oSocial: {
    sType: SocialMediaTypesEnums;
    sId: string;
    sToken: string;
  };
  nLoyaltyPoints: number;
  iCityId: number;
  iStateId: number;
  iCountryId: number;
  sState: string; //should be enum
  dDob: Date;
  sCity: string;
  sAddress: string;
  nPinCode: number;
  aDeviceToken: any;
  eStatus: UserStatusEnums;
  iReferredBy: ObjectId;
  sReferCode: string;
  sReferLink: string;
  dLoginAt: Date;
  dPasswordchangeAt: Date;
  sVerificationToken: string;
  bIsInternalAccount: boolean;
  sExternalId: string;
  sReferrerRewardsOn: string;
  ePlatform: PlatformTypesEnums;
  bIsKycApproved: boolean;

  dCreatedAt: Date
  dUpdatedAt: Date
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserKycAttributes {
  iUserId: ObjectId,
  sIdfyGroupId: string,
  oPan: {
    sNo: string,
    sDateOfBirth: string,
    eStatus: KYC_STATUS, // P = Pending, A = Accepted, R = Rejected, N = Not uploaded
    sImage: string,
    sName: string,
    sRejectReason: string,
    dCreatedAt: Date,
    dUpdatedAt: Date,
    oVerifiedAt: {
      dActionedAt: Date,
      iAdminId: ObjectId,
      sIP: string
    },
    eVerifiedBy: KYC_VERIFIED_BY
  },
  oAadhaar: {
    nNo: { type: Number },
    sAadharHashedNumber: string,
    sDateOfBirth: string,
    sAadharName: string,
    sFrontImage: string,
    sBackImage: string,
    eStatus: KYC_STATUS, // P = Pending, A = Accepted, R = Rejected, N = Not uploaded
    sRejectReason: string,
    dUpdatedAt: Date,
    dCreatedAt: Date,
    oVerifiedAt: {
      dActionedAt: Date,
      iAdminId: ObjectId,
      sIP: string
    },
    sPincode: string,
    sState: string,
    eVerifiedBy: KYC_VERIFIED_BY
  },
  sMessage: string,
  sExternalId: string
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FindByIdNotificationUserResponse {
  _id: ObjectId;
  sName: string,
  sUsername: string,
  sMobNum: string
}

export interface  userJwtToken {
  _id: ObjectId;
  eType: string;
  iat: number;
}
