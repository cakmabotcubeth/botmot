const Discord = require("discord.js");
const ayar = require("../configs/settings.json");
const Data = require("../models/isimData.js");
module.exports = {
	conf: {
		aliases: ["isimler"],
		name: "isimler",
		help: "isimler [Üye/ID]",
		enabled: true
	},

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {Array<string>} args
	 * @param {MessageEmbed} embed
	 * @returns {Promise<void>}
	 */
	run: async (client, message, args) => {

    if(!message.member.hasPermission("ADMINISTRATOR")) return message.react(ayar.Emojiler.no);


  let embedx = new Discord.MessageEmbed().setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
  .setColor("RANDOM").setTimestamp();  
  let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if(!uye) return message.channel.send(embedx.setDescription("Geçerli bir üye belirtmelisin!")).then(x => x.delete({timeout: 5000}));
 
        Data.find({user: uye.id}, async (err, res) => {
       let listed = res.reverse();
        let History = listed.map((x, index) => `\`${index + 1}.\` ${x.isim} (${x.cinsiyet})`).join("\n");
         
         message.lineReply(embedx.setDescription(`${History}`));
        });

  }
};