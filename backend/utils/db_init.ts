import configure from "../src/setup";
import { AppParams, MainContext, s_exe_s } from "../src/global";

const APP_NAME = require("../package.json").name;

////////////////////////////////////////////////////////////////////////////////////
// Main Proc
async function main(params: AppParams) {


    const app_name = APP_NAME;
    params.server_name = `${app_name} server`;
    params.app_name = app_name;
    params.init.database = true;
    params.init.session_store = true;

    await s_exe_s(`rm -rf ~/.cache/prisma*`);
    
    const context: MainContext = await configure(params);

    // DATABASE_URL="<protocol>://<username>:<password>@<host>:<port>/<database>"
    await s_exe_s(`DATABASE_URL=${process.env.DATABASE_URL} npx prisma db push --force-reset`);
    await context.clear_sessions();
    process.exit(0);
}



//////////////////////////////////////////////////////////////////////////////////////
// Single thread
const app_params = new AppParams();
main(app_params);