import dotenv from 'dotenv';
dotenv.config();

interface OptionCOnfig {
  useNewUrlParser: boolean,
  useUnifiedTopology: boolean,
  maxPoolSize?: number,
  readPreference?: "primary" | "primaryPreferred" | "secondary" | "secondaryPreferred" | "nearest",
}
interface MongoConfig {
  dbName: string,
  host: string,
  options: OptionCOnfig
  onConnect: () => void,
  onDisconnect: () => void
}

function onConnect() {
  console.log('MongoDB Connection Created:', this.dbName);
}

function onDisconnect() {
  console.log('MongoDB Connection Disconnected:', this.name);
}

const MongoOption: OptionCOnfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

const createDbObject = (dbName: string, db: string, dbPoolSize: number)=>{
  console.log(`${process.env.MONGO_INITIAL}${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_ENDPOINT}/${db}`)
  return {
    dbName: dbName,
    host: `${process.env.MONGO_INITIAL}${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_ENDPOINT}/${db}`,
    options:{
      ...MongoOption,
      maxPoolSize: dbPoolSize
    },
    onConnect,
    onDisconnect
  }
}

const createDbObject1 = (dbName: string, db: string, dbPoolSize: number)=>{
  console.log(`${process.env.MONGO_INITIAL}${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_ENDPOINT_2}/${db}`)
  return {
    dbName: dbName,
    host: `${process.env.MONGO_INITIAL}${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_ENDPOINT_2}/${db}`,
    options:{
      ...MongoOption,
      maxPoolSize: dbPoolSize
    },
    onConnect,
    onDisconnect
  }
}

const mongoConfig: { config: MongoConfig[] } = {
  config: [
    createDbObject('Users',process.env.USER_DB_NAME,Number(process.env.USERS_DB_POOLSIZE || 10)),
    createDbObject('Admins',process.env.ADMIN_DB_NAME,Number(process.env.ADMINS_DB_POOLSIZE || 10)),
    createDbObject1('Notifications',process.env.NOTIFICATION_DB_NAME,Number(process.env.NOTIFICATION_DB_POOLSIZE || 10))
  ]
};


export default mongoConfig;