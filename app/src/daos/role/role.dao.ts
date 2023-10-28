import { ObjectId } from 'mongoose';
import RoleModel, { RoleModelInput, RoleModelOutput } from "@models/role/role.model";
import BaseMongoDao from "@daos/baseMongoDao";

export default class RoleDao extends BaseMongoDao<RoleModelInput, RoleModelOutput> { 
  constructor(){
    super(RoleModel)
  }

  findActiveRolePermission = (iRoleId: ObjectId): RoleModelOutput => {
    return this.model.findOne({
      _id: iRoleId,
      eStatus: 'Y'
    }, {
      aPermissions: 1
    });
  }
}