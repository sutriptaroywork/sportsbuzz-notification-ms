import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import AdminModel, { AdminModelInput, AdminModelOutput } from "@models/admin/admin.model";
import BaseMongoDao from "@daos/baseMongoDao";
import mongoose, { ObjectId, Schema } from 'mongoose';
import { AdminJwtToken, FindByIdNotificationAdminResponse } from '@interfaces/admin/admin.interface';

// let tempId = new mongoose.Types.ObjectId("643e412cc908d2635ae91a8f");
// let tempToken = jwt.sign({
//   _id: tempId.toHexString()
// }, 'secret');
// console.log(tempToken);
// let decoded = jwt.verify(tempToken, 'secret');
// console.log(decoded)

export default class AdminDao extends BaseMongoDao<AdminModelInput, AdminModelOutput> { 
  constructor(){
    super(AdminModel)
  }

  findByToken = async (token: string) => {
    // type issue
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (e) {
      return Promise.reject(e)
    }
    const query = {
      _id: decoded._id,
      'aJwtTokens.sToken': token,
      eStatus: 'Y'
    }
    return this.model.findOne(query);
  }

  /**
   * used for get single notification api
   * @param id admin _id
   * @returns admin object
   */
  findByIdNotification = async (id: ObjectId): Promise<FindByIdNotificationAdminResponse> => {
    try {
      const adminData = await this.model.findById(id, {
        sName: 1,
        sUsername: 1
      });
      return adminData;
    }
    catch(error) {
      throw error;
    }
  }
}