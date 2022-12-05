const {Client, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder} = require("discord.js");
const ticketSchema = require("../../Models/Ticket");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Ticket actions")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addStringOption(option =>
        option
        .setName("addorremove")
        .setDescription("Add Or Remove From Ticket")
        .setRequired(true)
        .addChoices(
          {name: "Add", value: "add"},
          {name: "Remove", value: "remove"}
         ),
        )
       .addUserOption(option =>
        option
        .setName("member")
        .setDescription("Select Member From Server To Perform The Action")
        .setRequired(true)
        ),
        async execute(interaction) {
            const {guildId, options, channel} = interaction;

            const action = options.getString("addorremove");
            const member = options.getUser("member");

            const embed = new EmbedBuilder()

            switch (action) {
                case "add":
                    ticketSchema.findOne({GuildID: guildId, ChannelID: channel.id}, async(err, data) => {
                         if (err) throw err;
                         if (!data)
                              return interaction.reply({embeds: [embed.setColor("Red").setDescription("Moshkeli Pish Omad. Badan Dobare Emtehan Kon")], ephemeral: true});

                        if (data.MembersID.includes(member.id))
                        return interaction.reply({embeds: [embed.setColor("Red").setDescription("Moshkeli Pish Omad. Badan Dobare Emtehan Kon")], ephemeral: true});

                        data.MembersID.push(member.id);

                        channel.permissonOverwrites.edit(member.id, {
                            SendMessages: true,
                            ViewChannel: true,
                            ReadMessageHistory:true
                        });

                        interaction.reply({embeds: [embed.setColor("Green").setDescription(`${member} Ezafe Shod Be Ticket`)]});

                        data.save();
                    });
                    breake;
                    case "remove":
                        ticketSchema.findOne({GuildID: guildId, ChannelID: channel.id}, async(err, data) => {
                            if (err) throw err;
                            if (!data)
                                 return interaction.reply({embeds: [embed.setColor("Red").setDescription("Moshkeli Pish Omad. Badan Dobare Emtehan Kon")], ephemeral: true});
   
                           if (!data.MembersID.includes(member.id))
                           return interaction.reply({embeds: [embed.setColor("Red").setDescription("Moshkeli Pish Omad. Badan Dobare Emtehan Kon")], ephemeral: true});
   
                           data.MembersID.remove(member.id);
   
                           channel.permissonOverwrites.edit(member.id, {
                               SendMessages: false,
                               ViewChannel: false,
                               ReadMessageHistory:false 
                           });
   
                           interaction.reply({embeds: [embed.setColor("Green").setDescription(`${member} Ba Movafaghiat Hazf Shod Az Ticket`)]});
   
                           data.save();
                       });
                       breake;
            }
        }
}
