const Discord = require("discord.js");
const ayar = require("../configs/settings.json");
const Database = require("../models/registerData.js");

module.exports = {
	conf: {
		aliases: ["teyitbilgi"],
		name: "teyitbilgi",
		help: "teyitbilgi [Üye/ID]",
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
		
    if(!ayar.YetkiliRolleri.RegisterHammer.some(role => message.member.roles.cache.get(role)) && !message.member.hasPermission("ADMINISTRATOR")) return message.react(ayar.Emojiler.no);


  let embedx = new Discord.MessageEmbed().setAuthor(message.guild.name, message.guild.iconURL({dynamic: true})).setFooter(ayar.GenelAyarlar.setFooter).setColor("RANDOM").setTimestamp();  
  let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.author;
Database.findOne({userID : uye.id}, async(err, res) => {
if(!res) return message.channel.send("<@" + uye.id + "> kişisinin kayıt bilgisi bulunmuyor.")
message.channel.send(embedx.setDescription("<@" + uye.id + "> kişisinin " + res.erkek + " erkek," + res.kadin + " kadın kayıt bilgisi bulunmakta."))

}) 
}
};