const {ButtonInteraction, PermissionFlagsBits, EmbedBuilder} = require("discord.js");
const {createTranscript} = require('discord-html-transcripts');
const TicketSetup = require("../../Models/TicketSetup");
const ticketSchema = require("../../Models/Ticket");

module.exports = {
    name: "interactionCreate",

    async execute(interaction) {
        const {guild, member, customId, channel } = interaction;
        const {ManageChannels, SendMessages} = PermissionFlagsBits;

        if (!interaction.isButton() ) return;

        if (!["close", "lock", "unlock", "claim"].includes(customId)) return;

        const docs = await TicketSetup.findOne({GuildID: guildId.id});

        if (!docs) return;

        if(!guild.members.me.permissions.has((r)=> r.id === docs.Handlers))
        return interaction.reply({content: "شما دسترسی لازم برای انجام این عملیات ندارید", ephemeral : true});

        const ember = new EmbedBuilder().setColor("Red");

        ticketSchema.findOne({ChannelID: channel.id}, async(err, data) => {
            if (err) throw err;
            if(!data) return;


            const fetchedMember = await guild.members.cache.get(data.MembersID);

            switch (customId) {
                case "close" :
                if(data.closed == true)
                return interaction.reply({ content: "تیکت بسته شده است ", ephemeral: true });

                 const transcript = await createTranscript(channel, {
                    limit: -1,
                    returnBuffer: false,
                    fileName: `${member.user.username}-ticket${data.Type}-${data.TicketID}.html`,
                 });
                 await ticketSchema.updateOne({ChannelID: channel.id}, {Closed: true});

                 const transcriptEmbed =new EmbedBuilder()
                 .setTitle(`Transcript Type: ${data.Type}\nId: ${data.TicketID}`)
                 .setFooter({text: member.user.tag, iconURL: member.displayAvatarURL({dynamic: true})})
                 .setTimestamp();

                 const transcriptProcesss = new EmbedBuilder()
                 .setTitle('Darhal Save Kardan Be Sorat Transcript')
                 .setDescription("تیکت شما تا ده ثانیه دیگر بسته میشود،دی ام خود را برای فایل ترنسکریپت")
                 .setColor("Red")
                 .setFooter({text: member.user.tag, iconURL: member.displayAvatarURL({dynamic: true})})
                 .setTimestamp();
                
            const res = await guild.channels.cache.get(docs.Transcripts).send({
                embeds: [transcriptEmbed],
                files: [transcript],
            });
              
               channel.send({embeds: [transcriptProcesss]});

               setTimeout(function () {
                member.send({
                    embeds: [transcriptEmbed.setDescription(`Dastresi Be Ticket Transcript:${res.url} `)],
                }).catch(() => channel.send('ersal nashod\'  transcript be direct massege shoma '));
                   channel.delete();
            }, 10000);

               break;

               case "lock" : 
               if(!member.permissions.has(ManageChannels))
                return interaction.reply({constent: "شما دسترسی کافی برای اینکار ندارید", ephemeral: true});

                if(data.Locked == true)
                return interaction.reply({content: "تیکت شما همین الانم قفله /: ", ephemeral: true});

                await ticketSchema.updateOne({ChannelID: channel.id}, {Locked: true});
                const embedl = new EmbedBuilder()
                embed.setDescription("تیکت شما با موفقیت قفل شد");

                data.MembersID.forEach((m) => {
                    channel.permissionOverwrites.edit(m, { SendMessages: false });
                });

                return interaction.reply({embeds: [embedl]});
                     
                case "unlock" : 
                if(!member.permissions.has(ManageChannels))
                return interaction.reply({constent: "شما دسترسی کافی برای اینکار ندارید", ephemeral: true});

                if(data.Locked == true)
                return interaction.reply({content: "تیکت همین الانم بازه ", ephemeral: true});

                await ticketSchema.updateOne({ChannelID: channel.id}, {Locked: true});
                const embedun = new EmbedBuilder()
                .setDescription("تیکت با موفقیت باز شد ");

                data.MembersID.forEach((m) => {
                    channel.permissionOverwrites.edit(m, { SendMessages: true });
                });
                
                return interaction.reply({embeds: [embedun]});

                case "claim":
                    if (!member.permissions.has(ManageChannels))
                    return interaction.replyinteraction.reply({constent: "شما دسترسی کافی برای اینکار ندارید", ephemeral: true});

                    if (data.Claimed == true)
                    return interaction.reply({content: `Ticket Hamin Alan Claim Shode Tavasot <@${data.ClaimedBy}>, ephemeral: true`});

                    await ticketSchema.updateOne({ChannelID: channel.id}, {Claimed: true, ClaimedBy: member.id});

                    embed.setDescription(`Ticket Ba Movafaghiat Claim Shod Tavasot ${member}`);

                 interaction.reply({embeds: [embed]});

                 breake;



            }
        });
    }
}






