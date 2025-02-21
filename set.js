const fs = require('fs-extra');
const path = require("path");
const { Sequelize } = require('sequelize');

// Load environment variables if the .env file exists
if (fs.existsSync('set.env')) {
    require('dotenv').config({ path: __dirname + '/set.env' });
}

const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined ? databasePath : process.env.DATABASE_URL;

module.exports = {
    session: process.env.SESSION_ID || 'FLASH-MD-WA-BOT;;;=>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiVUt2MEF2TVU3VWxnc2VtNnRJWHZmaDR1di9XOTVNZFFuZGxjQ3o5U1ZVQT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiajdublppcjZnMlFZMUxINEw2MTFxQjIyYk1Zbzdwd3lCSkJYUmFiR3QwVT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ1RWhBdTk5eXduanZnVWtNb0IvRzZrVmo2MGFFejJ4bTJNYXRQajFsU1c4PSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJBMjYrSTJmVWdpcXpuVmU3MHRleU5xYWl0WTFZaFFUYUlFdmRybk9aUDNjPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IndEQTNQay9FUW9lZFZ6OGZ1bjQ0T0g4cVdsb2JFRFhWZGpiNGFjMjdBV289In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ik9BVXRNb0RLTW0xRGVFNEtqb3FlekZuaEFrZThodFdUNXhtNUNaTEFpR2s9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiMkwvdEJpSjA4L2VnekZhK2RGanZ6VVF4ckhPQWtmaFJmZDh0TmVCMkUxVT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiOFoycjR3c0ltaTdFTGJ4eUVUM2xYMnZZZWJKU3ExZkRIOVRHV1hxUFhDQT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IklkR1A1RjcyWmxuNzFPV1dQc2lUNE9FNnB3d1NiMTVMcHIyV0VTUEFVeWtpYVgza0tFU1lwcUI0ZUFRRWh6V25LVm16ZHNJU3RnZ01LRUJJcWxtK2dBPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjI2LCJhZHZTZWNyZXRLZXkiOiJrNC96SXBVUTFhNkg0QzI3VjdscWFCOVBQbUwyNmM0QXdMUG1PeDFDeWdJPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJzVC1abnprWVJpR0o2Y3ZINTRtMUtnIiwicGhvbmVJZCI6IjkyZDU3MmMyLWY0MzktNGZiOS1iNzYwLWJmNjFlOTYxNjkwYSIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJWSFl4Ri9zYWRmWlBITVJBTFU5L3lGdDJPbmc9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUVVVeDh6QlhPVEVTRStoQUlRMXd3eHcvbVBFPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IlNDOUo3QkxMIiwibWUiOnsiaWQiOiIyMDExMjUxNjY0ODY6ODVAcy53aGF0c2FwcC5uZXQiLCJuYW1lIjoibXIgaGFpdGhhbSJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDSzNhblBZQ0VNejI0YjBHR0FJZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiNFczbVhlc2ZhbHdaand0Ymd1Vm5CQjBkT0lPUU0wSE9ENzF5T3hEd05sdz0iLCJhY2NvdW50U2lnbmF0dXJlIjoiZW5mQlZRNEViMWFCSllpRWRrZnBJMU9ISUxrcU1hSmJzRE53LzNFeFVGR0p0MVNGdi92dUY1cElRaU1YL2o1ZG5aUGN6dWVFaGhtVzJ5dHFrR1hLRHc9PSIsImRldmljZVNpZ25hdHVyZSI6Ii9qRlJlcmVnMU53QTVoSHM2YTVuSHBCeUJkYUhhZ3Rka3A1WW93Sk40Tit0amFjaVAwWjVvOVgxNGExNlVJN1ptVk8yL0JPakVXU3BNd2xINk03Qmp3PT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjAxMTI1MTY2NDg2Ojg1QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQmVGdDVsM3JIMnBjR1k4TFc0TGxad1FkSFRpRGtETkJ6Zys5Y2pzUThEWmMifX1dLCJwbGF0Zm9ybSI6InNtYmEiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3NDAxNDM0NDksIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBS2VCIn0=',
    PREFIXES: (process.env.PREFIX || '').split(',').map(prefix => prefix.trim()).filter(Boolean),
    OWNER_NAME: process.env.OWNER_NAME || "haitham King",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "201125166486",
    AUTO_LIKE: process.env.STATUS_LIKE || "off",
    AUTO_READ_STATUS: process.env.AUTO_VIEW_STATUS || "on",
    AUTOREAD_MESSAGES: process.env.AUTO_READ_MESSAGES || "on",
    CHATBOT: process.env.CHAT_BOT || "off",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_SAVE_STATUS || 'off',
    A_REACT: process.env.AUTO_REACTION || 'on',
    L_S: process.env.STATUS_LIKE || 'on',
    AUTO_BLOCK: process.env.BLOCK_ALL || 'off',
    URL: process.env.MENU_LINKS || 'https://files.catbox.moe/c2jdkw.jpg',
    MODE: process.env.BOT_MODE || "private",
    PM_PERMIT: process.env.PM_PERMIT || 'on',
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
    ANTIVIEW: process.env.VIEWONCE,
    HEROKU_API_KEY: process.env.HEROKU_API_KEY,
    WARN_COUNT: process.env.WARN_COUNT || '3',
    PRESENCE: process.env.PRESENCE || '',
    ADM: process.env.ANTI_DELETE || 'on',
    TZ: process.env.TIME_ZONE || 'Africa/Nairobi',
    DP: process.env.STARTING_MESSAGE || "on",
    ANTICALL: process.env.ANTICALL || 'on',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://flashmd_user:JlUe2Vs0UuBGh0sXz7rxONTeXSOra9XP@dpg-cqbd04tumphs73d2706g-a/flashmd"
        : "postgresql://flashmd_user:JlUe2Vs0UuBGh0sXz7rxONTeXSOra9XP@dpg-cqbd04tumphs73d2706g-a/flashmd",
    W_M: null, // Add this line
};

// Watch for changes in this file and reload it automatically
const fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`Updated ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
