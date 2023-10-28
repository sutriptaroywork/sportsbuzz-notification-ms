import {ClientSession} from "mongoose"
import db from "../../connections/database/mongodb/mongoConfig"
// import 
export default class BaseMongoDao<InputT, OutputT> {
    model : any

    constructor(model: any){
        this.model = model
    }

    public findById = async (id : string) : Promise<OutputT> => {
        let result = await this.model.findById(id)
        return result
    }

    public create = async(input : InputT): Promise<OutputT> => {
        let result = await this.model.create(input)
        return result
    }

    // public find = async (input: any, projection?: any): Promise<OutputT[]> => {
    //     let result = await this.model.find(input, projection);
    //     return result;
    // };

    // public findOne = async (input: any): Promise<OutputT> => {
    //     let result = await this.model.findOne(input);
    //     console.log('base mongo', input, result, this.model);
    //     return result;
    // };

    // public countDocument = async (input): Promise<OutputT> => {
    //     let result = await this.model.countDocuments(input);
    //     return result;
    // };

    // public findOneAndUpdate = async (filter:any, data: any): Promise<OutputT> =>{
    //     let result = await this.model.findOneAndUpdate(filter, data, {new: true, upsert: true});
    //     return result;
    // }

    // public startMongoTransaction = () : ClientSession =>  {
    //     return db.startTransaction()
    // }

    // public getAllPaginated = (limit : number, offset : number, sort: {field : string, order: string} = null, filter : null): Promise<{ rows: OutputT[]; count: number }> => {
    //     let orderArr: Array<Array<string>> = [];
    // }

    
}