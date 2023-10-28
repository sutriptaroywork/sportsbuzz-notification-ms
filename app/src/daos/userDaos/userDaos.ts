import { ObjectId } from "mongoose";
import UserModel, { UserModelInput, UserModelOutput } from "@models/userModel/userModel";
import BaseMongoDao from "@daos/baseMongoDao";
import { FindByIdNotificationUserResponse } from "@interfaces/user/user.interface";

export default class UserDao extends BaseMongoDao<UserModelInput, UserModelOutput> { 
  constructor(){
    super(UserModel)
  }

  /**
   * used for get single notification api
   * @param id user _id
   * @returns user object
   */
  findByIdNotification = async (id: ObjectId): Promise<FindByIdNotificationUserResponse> => {
    try {
      const adminData = await this.model.findById(id, {
        sName: 1,
        sUsername: 1,
        sMobNum: 1
      });
      return adminData;
    }
    catch(error) {
      throw error;
    }
  }
}