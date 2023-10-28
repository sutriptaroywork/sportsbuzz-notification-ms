import { Schema, model } from 'mongoose';
import { ObjectId } from 'mongoose';

import { AdminTypeEnums } from '@enums/adminTypeEnums/adminTypeEnums';
import { AdminPanelPermissionScopeEnums } from '@enums/AdminPanelPermissionScopeEnums/AdminPanelPermissionScopeEnums';
import { AdminPermissionTypeEnums } from '@enums/adminPermissionTypeEnums/adminPermissionTypeEnums';
import { AdminStatusEnums } from '@enums/adminStatusEnums/adminStatusEnums';
import RoleModel from '@models/role/role.model';
import { AdminsDBConnect } from '@connections/database/mongodb/mongodb';

const COLLECTION_NAME = 'admins';
interface AdminAttributes {
  _id: ObjectId
  sName: string;
  sUsername: string;
  sEmail: string;
  sMobNum: string;
  sProPic: string;
  eType: AdminTypeEnums;
  aPermissions: Array<{
    eKey: AdminPanelPermissionScopeEnums;
    eType: AdminPermissionTypeEnums;
  }>;
  iRoleId: ObjectId;
  sPassword: string;
  eStatus: AdminStatusEnums;
  aJwtTokens: Array<{
    sToken: string;
    sPushToken: string;
    dTimeStamp: Date;
  }>;
  dLoginAt: Date;
  dPasswordchangeAt: Date;
  sVerificationToken: string;
  sExternalId: string;
  sDepositToken: string;

  dCreatedAt: Date;
  dUpdatedAt: Date;
}

export interface AdminModelInput extends Omit<AdminAttributes, '_id' | 'dCreatedAt' | 'dUpdatedAt'> {}
export interface AdminModelOutput extends Required<AdminAttributes> {}

const AdminSchema = new Schema<AdminAttributes>(
  {
    sName: {
      type: String,
      trim: true,
      required: true
    },
    sUsername: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    sEmail: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    sMobNum: {
      type: String,
      trim: true,
      required: true
    },
    sProPic: {
      type: String,
      trim: true
    },
    eType: {
      type: String,
      enum: AdminTypeEnums,
      required: true
    },
    aPermissions: [
      {
        eKey: {
          type: String,
          enum: AdminPanelPermissionScopeEnums
        },
        eType: {
          type: String,
          enum: AdminPermissionTypeEnums
        }
      }
    ],
    iRoleId: {
      type: Schema.Types.ObjectId,
      ref: RoleModel
    },
    sPassword: {
      type: String,
      trim: true,
      required: true
    },
    eStatus: {
      type: String,
      enum: AdminStatusEnums,
      default: AdminStatusEnums.ACTIVE
    },
    aJwtTokens: [
      {
        sToken: {
          type: String
        },
        sPushToken: {
          type: String,
          trim: true
        },
        dTimeStamp: {
          type: Date,
          default: Date.now
        }
      }
    ],
    dLoginAt: {
      type: Date
    },
    dPasswordchangeAt: {
      type: Date
    },
    sVerificationToken: {
      type: String
    },
    sExternalId: {
      type: String
    },
    sDepositToken: {
      type: String
    }
  },
  {
    timestamps: {
      createdAt: 'dCreatedAt',
      updatedAt: 'dUpdatedAt'
    },
    toJSON: {
      virtuals: true,
    }
  }
);

const AdminModel = AdminsDBConnect.model(COLLECTION_NAME, AdminSchema);

export const adminCollectionName = COLLECTION_NAME; 
export default AdminModel;
