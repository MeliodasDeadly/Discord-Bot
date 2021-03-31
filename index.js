const { Client, RichEmbed, bot } = require("discord.js");
const client = new Client({
  disableEveryone: true
})
const enmap = require('enmap');
const Discord = require('discord.js');
const {token, prefix} = require('./config.json');
const link = "discord.gg/SGRtRHHRWJ"
const creatorname = "Méliodas Deadly"
const playerprofile = "https://media.tenor.com/images/165d76941b9791fd54767ceb38ef5598/tenor.gif"
const botinvite = "https://discord.com/api/oauth2/authorize?client_id=754274449649565767&permissions=8&scope=bot"
const partner = "https://discord.gg/5WKrWpjHKu"
const settings = new enmap({
  name: "settings",
  autoFetch: true,
  cloneLevel: "deep",
  fetchAll: true
});

client.on("ready", () => {
  console.log(`Méliodas est en ligne . `);
})

client.on('ready', () => {
  client.user.setActivity(`Sky bot`, { type: "WATCHING" })
});

client.on('message', msg => {
  if (msg.content === prefix + 'objection') {
    msg.reply('OBJECTION! ||https://media.giphy.com/media/3JZPieLnu8THVlSmfJ/giphy.gif||');
  }
})
client.on('message', msg => {
  if (msg.content === prefix + 'by') {
    const createur = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setTitle(creatorname)
  .setDescription('Voici mon créateur !!')
  .setAuthor('Méliodas', `https://media.tenor.com/images/165d76941b9791fd54767ceb38ef5598/tenor.gif`, `https//discord.gg/eAHTwmwT55`)
;
msg.channel.send(createur); 
  }
})

client.on('message', msg => {
  if (msg.content === prefix + 'help') {
  const exampleEmbed = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setTitle("Méliodas")
	.setDescription('Toutes mes commandes')
	.addFields(
		{ name: `${prefix}link`, value: "permet d'obtenir une invitation" },
		{ name: '\u200B', value: '\u200B' },
		{ name: `${prefix}objection`, value: "permet d'obtenir l'objection ", inline: true },
		{ name: `${prefix}ping`, value: "Permet de s'avoir le ping du bot", inline: true },
	)
;
msg.channel.send(exampleEmbed); 
}
});

client.on('message', msg => {
  if (msg.content === prefix + 'link') {
    msg.reply('Invitation :\n' + link );
  }
});

client.on('message', async (message) => {
  if (
    message.content.toLowerCase().startsWith(prefix + 'clear') ||
    message.content.toLowerCase().startsWith(prefix + 'c ')
  ) {
    if (!message.member.hasPermission('MANAGE_MESSAGES'))
      return message.channel.send("You cant use this command since you're missing `manage_messages` perm");
    if (!isNaN(message.content.split(' ')[1])) {
      let amount = 0;
      if (message.content.split(' ')[1] === '1' || message.content.split(' ')[1] === '0') {
        amount = 1;
      } else {
        amount = message.content.split(' ')[1];
        if (amount > 100) {
          amount = 100;
        }
      }

      await message.delete().catch(e => { amount++; });

      await message.channel.bulkDelete(amount, true).then((_message) => {
        message.channel.send(`Bot cleared \`${_message.size}\` messages :broom:`).then((sent) => {
          setTimeout(function () {
            sent.delete();
          }, 2500);
        });
      });
    } else {
      message.channel.send('enter the amount of messages that you would like to clear').then((sent) => {
        setTimeout(function () {
          sent.delete();
        }, 2500);
      });
    }
  } else {
    if (message.content.toLowerCase() === prefix + 'help clear') {
      const newEmbed = new Discord.MessageEmbed().setColor('#00B2B2').setTitle('**Clear Help**');
      newEmbed
        .setDescription('This command clears messages for example `.clear 5` or `.c 5`.')
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();
      message.channel.send(newEmbed);
    }
  }
});

client.on("message", async message => { 
  if(message.content === prefix + 'invitebot') {
    message.reply("Im a personal bot , escuse me ")
  }

  if(message.content === prefix +'partner') {
    message.reply("Partner : " + partner )
  }
})

client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content.startsWith(prefix)) return;

  var yourping = new Date().getTime() - message.createdTimestamp
  var botping = Math.round(client.ws.ping)


  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd === "ping") {
      const msg = await message.channel.send(`🏓 Pinging....`);
      msg.edit(`🏓 Pong! (ms: ${botping}) `);
  }
})
client.on('message', async message => {
    if(message.author.bot) return;
    if(message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command == "ticket-setup") {
        // ticket-setup #channel

        let channel = message.mentions.channels.first();
        if(!channel) return message.reply("Usage: `!ticket-setup #channel`");

        let sent = await channel.send(new Discord.MessageEmbed()
            .setTitle("Ticket System")
            .setDescription("React to open a ticket!")
            .setFooter("Ticket System")
            .setColor("00ff00")
        );

        sent.react('🎫');
        settings.set(`${message.guild.id}-ticket`, sent.id);

        message.channel.send("Ticket System Setup Done!")
    }

    if(command == "close") {
        if(!message.channel.name.includes("ticket-")) return message.channel.send("You cannot use that here!")
        message.channel.delete();
    }
});

client.on('messageReactionAdd', async (reaction, user) => {
    if(user.partial) await user.fetch();
    if(reaction.partial) await reaction.fetch();
    if(reaction.message.partial) await reaction.message.fetch();

    if(user.bot) return;

    let ticketid = await settings.get(`${reaction.message.guild.id}-ticket`);

    if(!ticketid) return;

    if(reaction.message.id == ticketid && reaction.emoji.name == '🎫') {
        reaction.users.remove(user);

        reaction.message.guild.channels.create(`ticket-${user.username}`, {
            permissionOverwrites: [
                {
                    id: user.id,
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                },
                {
                    id: reaction.message.guild.roles.everyone,
                    deny: ["VIEW_CHANNEL"]
                }
            ],
            type: 'text'
        }).then(async channel => {
            channel.send(`<@${user.id}>`, new Discord.MessageEmbed().setTitle("Welcome to your ticket!").setDescription("We will be with you shortly").setColor("00ff00"))
        })
    }
});

client.on('guildMemberAdd', member => {
  const hello = new Discord.MessageEmbed()
	.setTitle('Salutation ' + member.user + " merci d'avoir rejoint , je me ferais un plaisir de te faire découvrir le serveur")
	.setImage('https://media.giphy.com/media/Cmr1OMJ2FN0B2/giphy.gif')

 member.guild.channels.get('767674285345996821').send(hello);
});



client.on('message', async message => {

  if (msg.member.hasPermission("KICK_MEMBERS")) {
    if (msg.members.mentions.first()) {
        try {
            msg.members.mentions.first().kick();
        } catch {
            msg.reply("I do not have permissions to kick " + msg.members.mentions.first());
        }
    } else {
        msg.reply("You do not have permissions to kick " + msg.members.mentions.first());
    }
}

if (msg.member.hasPermission("BAN_MEMBERS")) {
  if (msg.members.mentions.first()) {
      try {
          msg.members.mentions.first().ban();
      } catch {
          msg.reply("I do not have permissions to ban" + msg.members.mentions.first());
      }
  } else {
      msg.reply("You do not have permissions to ban" + msg.members.mentions.first());
  }
}
})

client.on('message', (message) => {
  if (message.content == '/muteAll') {
      let channel = message.member.voiceChannel;
      for (let member of channel.members) {
          member[1].setMute(true)
      }
   }
});



// Invitation : https://discord.com/api/oauth2/authorize?client_id=754274449649565767&permissions=8&scope=bot

client.login(process.env.TOKEN);