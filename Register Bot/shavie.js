const { Discord, Client, Collection } = require("discord.js");
const client = (global.client = new Client({ fetchAllMembers: true }));
const ayar = require("./src/configs/settings.json");

client.commands = new Collection();

require("./src/handlers/commandHandler");
require("./src/handlers/eventHandler");
require("./src/handlers/mongoHandler");
  
client
  .login(ayar.GenelAyarlar.Token)
  .then(() => console.log("[BOT] Bot connected!"))
  .catch(() => console.log("[BOT] Bot can't connected!"));

client.on('ready', async () => {
    client.user.setPresence({ activity: { name: ayar.GenelAyarlar.BotDurum }, status: "online" });
    client.channels.cache.get(ayar.GenelAyarlar.BotSesKanali).join();
});
