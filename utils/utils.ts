import Backendless from 'backendless';
import { RpwUser } from '../types/types';


Backendless.initApp(process.env.BackendlessAppId!, process.env.BackendlessApiKey!);

export async function isAdmin(userId?: number): Promise<boolean> {
  if (!userId) {
    return false;
  }

  try {
    const query = Backendless.DataQueryBuilder.create().setWhereClause(`telegramId='${userId}'`);
    const result = await Backendless.Data.of('rpw_users').find<RpwUser>(query);
    if (result.length === 0) {
      throw new Error(`User with Telegram ID ${userId} not found in "rpw_users" table`);
    }

    const rpwUser = result[0] as RpwUser;
    console.log(`User ${rpwUser.telegramUsername} is admin: ${rpwUser.isAdmin}`);
    return rpwUser.isAdmin === true;
  } catch (error) {
    console.error(`Error checking if user is admin: ${error}`);
    return false;
  }
}
