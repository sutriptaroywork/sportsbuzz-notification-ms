import ConnectionProvider, { MongooseConnectionClient } from '@buzzsports/sportsbuzz11-connection-provider';

import connectionEvent from '../../../events/connectionEvent';
import mongoConfig from './mongoConfig';

interface MongooseConnection extends InstanceType<typeof MongooseConnectionClient> {}

/**
 * creating an instance of ConnectionProvider and initialising mongodb
 */
const instance = new ConnectionProvider({ mongodb: mongoConfig, connectionEvent })
const connections = instance.mongoInit();
// console.log(connections);


export const [UsersDBConnect, AdminsDBConnect, NotificationsDBConnect]: MongooseConnection[] = connections;

export default connections;
// export const GamesDBConnect = connection(process.env.GAME_DB_URL, parseInt(process.env.GAME_DB_POOLSIZE), 'Game');
// export const MatchDBConnect = connection(process.env.MATCH_DB_URL, parseInt(process.env.MATCH_DB_POOLSIZE), 'Match');
// export const FantasyTeamConnect = connection(process.env.FANTASY_TEAM_DB_URL, parseInt(process.env.FANTASY_TEAM_DB_POOLSIZE), 'FantasyTeam');
// export const LeaguesDBConnect = connection(process.env.LEAGUES_DB_URL, parseInt(process.env.LEAGUES_DB_POOLSIZE), 'Leagues');
// export const SeriesLBDBConnect = connection(process.env.SERIES_LB_DB_URL, parseInt(process.env.SERIES_LB_DB_POOLSIZE), 'Series Leader-Board');
// export const StatisticsDBConnect = connection(process.env.STATISTICS_DB_URL, parseInt(process.env.STATISTICS_DB_POOLSIZE), 'Statistics');
// export const BannersDBConnect = connection(process.env.BANNERS_DB_URL, parseInt(process.env.BANNERS_DB_POOLSIZE), 'Banners');
// export const ComplaintsDBConnect = connection(process.env.COMPLAINS_DB_URL, parseInt(process.env.COMPLAINS_DB_POOLSIZE), 'Complaints');
// export const FantasyTipsDBConnect = connection(process.env.FANTASYTIPS_DB_URL, parseInt(process.env.FANTASYTIPS_DB_POOLSIZE), 'FantasyTips');
// export const PromocodesDBConnect = connection(process.env.PROMOCODES_DB_URL, parseInt(process.env.PROMOCODES_DB_POOLSIZE), 'Promocodes');
// export const GeoDBConnect = connection(process.env.GEO_DB_URL, parseInt(process.env.GEO_DB_POOLSIZE), 'Geo');
// export const ReportDBConnect = connection(process.env.REPORT_DB_URL, parseInt(process.env.REPORT_DB_POOLSIZE), 'Report');
