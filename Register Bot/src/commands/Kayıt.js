const Discord = require("discord.js");
const ayar = require("../configs/settings.json");
const Database = require("../models/registerData.js");
const Data = require("../models/isimData.js");

module.exports = {
	conf: {
		aliases: ["kayıt", "erkek", "kadın", "e", "k"],
		name: "kayıt",
		help: "kayıt [Üye/ID] [İsim] [Yaş]",
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
  let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if(!uye) return message.channel.send(embedx.setDescription("Geçerli bir üye belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  let nick = args.slice(1).filter(arg => isNaN(arg)).map(arg => arg.charAt(0).toUpperCase() + arg.slice(arg.charAt(0).length).toLowerCase()).join(" ");
  let yas = Number(args[2]);
  if(!nick || !yas) return message.channel.send(embedx.setDescription("Geçerli bir isim ve yaş belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  if (message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(embedx.setDescription(`Kayıt etmeye çalıştığın kişi seninle aynı yetkide veya senden daha üstte olduğu için işlemi gerçekleştiremedim.`)).then(x => x.delete({timeout: 10000}));
  const isim = `${uye.user.username.includes(ayar.GenelAyarlar.Tag) ? ayar.GenelAyarlar.Tag : ayar.GenelAyarlar.UnTag} ${nick} ' ${yas}`
  if(ayar.Roller.ErkekRol.some(x => uye.roles.cache.has(x))) return message.channel.send("<@" + uye.id + "> kişisi zaten kayıtlı.")
  if(ayar.Roller.KadinRol.some(x => uye.roles.cache.has(x))) return message.channel.send("<@" + uye.id + "> kişisi zaten kayıtlı.")
  await uye.setNickname(isim)
await message.channel.send("<@" + uye.id + "> kişisinin ismi " + isim + " olarak değiştirildi.").then(async msg => {
await message.react(ayar.Emojiler.Erkek)
await message.react(ayar.Emojiler.Kadın)

const erkekemoji = (reaction, user) => reaction.emoji.id === ayar.Emojiler.Erkek && user.id === message.author.id;
const kadinemoji = (reaction, user) => reaction.emoji.id === ayar.Emojiler.Kadın && user.id === message.author.id;

const erkek = message.createReactionCollector(erkekemoji, { time: 999999 });
const kadin = message.createReactionCollector(kadinemoji, { time: 999999 });

erkek.on('collect', async() => {
await message.reactions.removeAll()
await message.react(ayar.Emojiler.Tik)
await uye.roles.add(ayar.Roller.ErkekRol)
await uye.roles.remove(ayar.Roller.UnregisterRol)

new Data({
  user: uye.id,
  yetkili: message.author.id,
  isim: isim,
  cinsiyet: "Erkek"
}).save().catch(e => console.error(e))
await Database.findOneAndUpdate({ userID: message.author.id }, { $inc: { erkek: 1, toplam: 1 } }, { upsert: true });
msg.edit("<@" + uye.id + "> kişisi erkek olarak kayıt edildi.")
client.channels.cache.get(ayar.GenelAyarlar.GenelChatID).send(`Aramıza yeni biri katıldı! <@${uye.user.id}> ona hoş geldin diyelim!`).then(x => x.delete({timeout:10000}));

})

kadin.on('collect', async() => {
  await message.reactions.removeAll()
  await message.react(ayar.Emojiler.Tik)
  await uye.roles.add(ayar.Roller.KadinRol)
  await uye.roles.remove(ayar.Roller.UnregisterRol)

  new Data({
    user: uye.id,
    yetkili: message.author.id,
    isim: isim,
    cinsiyet: "Kadın"
  }).save().catch(e => console.error(e))
    
  
  await Database.findOneAndUpdate({ userID: message.author.id }, { $inc: { kadin: 1, toplam: 1 } }, { upsert: true });
  msg.edit("<@" + uye.id + "> kişisi kadın olarak kayıt edildi.")

})
})

	}
};