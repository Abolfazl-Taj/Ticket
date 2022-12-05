const {ChannelType, ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits} = require("discord.js");
const ticketSchema = require("../../Models/Ticket");
const TicketSetup = require("../../Models/TicketSetup");

module.exports = {
    name: "interactionCreate",

    async execute(interaction) {
        const {guild, member, customId, channel} = interaction;
        const {ViewChannel, SendMessages, MangeChannels, ReadMessageHistory} = PermissionFlagsBits;
        const ticketId = Math.floor(Math.random() * 9000) + 10000;

        if (!interaction.isButton()) return;

  const data = await TicketSetup.findOne({GuildID: guildId.id});

  if (!data)
  return;

  if (!data.Buttons.includes(customId))
  return;

        if (!guild.members.me.permissions.has(MangeChannels))
        interaction.reply({ content: "perm nadari" , ephemeral: true });

        try {
            await guild.channels.create({
                name: `${member.user.username}-ticket${ticketId}`,
                type: ChannelType.GuildText,
                parent: data.Category,
                permissionOverwrites: [
                    {
                        id: data.Everyone,
                        deny: [ViewChannel, SendMessages, ReadMessageHistory],
                    },
                    {
                        id: member.id,
                        allow: [ViewChannel, SendMessages, ReadMessageHistory],
                    },
                ],
            }).then(async (channel) => {
                const newTicketSchema = await ticketSchema.create({
                    GuildID: guild.id,
                    MembersID: member.id,
                    TicketID: ticketId,
                    ChannelID: channel.id,
                    Closed: false,
                    Locked: false,
                    Type: customId,
                    Claimed: false
                });

                const embed = new EmbedBuilder()
                .setTitle(`${guild.name} - Ticket: ${customId}`)
                .setDescription("matn")
                .setFooter({ text: `${ticketId}`, iconURL: member.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();

                const button = new ActionRowBuilder().setComponents(
                    new ButtonBuilder().setCustomId('close').setLabel('close').setStyle(ButtonStyle.Danger).setEmoji('<:Close:1048983954960691210>'),
                    new ButtonBuilder().setCustomId('lock').setLabel('lock').setStyle(ButtonStyle.Success).setEmoji('<:Lock:1048983961596084294>'),
                    new ButtonBuilder().setCustomId('unlock').setLabel('unlock').setStyle(ButtonStyle.Secondary).setEmoji('<:UnLock:1048983957397569588>'),
                    new ButtonBuilder().setCustomId('claim').setLabel('claim').setStyle(ButtonStyle.Link).setEmoji('<:Claim:1048983949491318795>'),
                );
                channel.send({
                    embeds: ([embed]),
                    components: [
                        button
                    ]
                });

                interaction.reply({ content: "created", ephemeral: true });
            });
        } catch (err) {
           return console.log(err);
        }
    }             
}
