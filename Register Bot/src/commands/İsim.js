const { MessageEmbed } = require('discord.js');
const Discord = require("discord.js");
const Data = require("../models/isimData.js")
const ayar = require("../configs/settings.json");

module.exports = {
	conf: {
		aliases: ["nick", "i"],
		name: "isim",
		help: "isim [Üye/ID] [İsim] [Yaş]",
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
		
  let embed = new Discord.MessageEmbed().setAuthor(message.guild.name, message.guild.iconURL({dynamic: true})).setFooter(ayar.GenelAyarlar.setFooter).setColor("RANDOM").setTimestamp();  
    if(!ayar.YetkiliRolleri.RegisterHammer.some(role => message.member.roles.cache.get(role)) && !message.member.hasPermission("ADMINISTRATOR")) return message.react(ayar.Emojiler.no);
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
	let nick = args.slice(1).filter(arg => isNaN(arg)).map(arg => arg.charAt(0).toUpperCase() + arg.slice(arg.charAt(0).length).toLowerCase()).join(" ");	
	let yas = Number(args[2]);
	if(!nick || !yas) return message.channel.send(embedx.setDescription("Geçerli bir isim ve yaş belirtmelisin!")).then(x => x.delete({timeout: 5000}));   
	const isim = `${member.user.username.includes(ayar.GenelAyarlar.Tag) ? ayar.GenelAyarlar.Tag : ayar.GenelAyarlar.UnTag} ${nick} ' ${yas}`
    if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send(embed.setDescription(`İsmini değiştirmeye çalıştığın kişi seninle aynı yetkide veya senden daha üstte olduğu için işlemi gerçekleştiremedim.`)).then(x => x.delete({timeout: 10000}));
 await message.react(ayar.Emojiler.Tik);
 await member.setNickname(isim)
 new Data({
    user: member.id,
    yetkili: message.author.id,
    isim: isim,
    cinsiyet: "İsim Değiştirme"
  }).save().catch(e => console.error(e))
     message.channel.send("<@" + member.id + "> kişisinin ismi **" + isim + "** olarak değiştirildi.")
	}
};