const {Client, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,  ChannelType} = require("discord.js");
//const {openticket} = require("../../config.json");
const TicketSetup = require("../../Models/TicketSetup");

module.exports = {
    data : new SlashCommandBuilder()
     .setName("ticketcreate")
     .setDescription("sakht pannel ticket")
     .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
     .addChannelOption(option =>
        option
        .setName("channel")
        .setDescription("Braye Dorost Shodan Ticket Ha Yek Channel Ra Entekhab Konid")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
        )
        .addChannelOption(option =>
            option
            .setName("category")
            .setDescription("Category Ke Ticket Ha Bayad Anja Bashad Ra Entekhab Konid")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildCategory)
            )
            .addChannelOption(option =>
                option
                .setName("transcripts")
                .setDescription("Channel Transcript Ra Entekhab Konid")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
                )
                .addRoleOption(option =>
                    option
                    .setName("handlers")
                    .setDescription("Role Ke Mitavanand Masoliat Ticket Ra Barhode Bgirand Ra Entekhab Konid")
                    .setRequired(true)
                    )
                    .addRoleOption(option =>
                        option
                        .setName("everyone")
                        .setDescription("Role Every One Server Khodeton Ro Entekhab Knonid")
                        .setRequired(true)
                        )
                        .addStringOption(option =>
                            option
                            /*Des*/ .setName("description")
                            .setDescription("Tozihat Embed Ticket Ra Bnvisid")
                            .setRequired(true)
                            )
                            .addStringOption(option =>
                                option
                                .setName("firstbutton")
                                .setDescription("Matn Dokme Ye Aval Ra Bnvisid Be Sorat: (Esm Dokme, Emoji)")
                                .setRequired(true)
                                )
                                .addStringOption(option =>
                                    option
                                    .setName("secondbutton")
                                    .setDescription("Matn Dokme Ye Dovom Ra Bnvisid Be Sorat: (Esm Dokme, Emoji)")
                                    .setRequired(true)
                                )
                                .addStringOption(option =>
                                    option
                                    .setName("thirdbutton")
                                    .setDescription("Matn Dokme Ye sevom Ra Bnvisid Be Sorat: (Esm Dokme, Emoji)")
                                    .setRequired(true)
                                    ),                        
    async execute(interaction) {
        const {guild, options } = interaction;

        try {
             const channel = options.getChannel("channel");
             const category = options.getChannel("category");
             const transcripts = options.getChannel("transcripts");

             const handelers = options.getRole("handelers");
             const everyone = options.getRole("everyone");

             const description = options.getString("description");
             const firstbutton = options.getString("firstbutton").split(",");
             const secondbutton = options.getString("secondbutton").split(",");
             const thirdbutton = options.getString("thirdbutton").split(",");

             const emoji1 = firstbutton[1];
             const emoji2 = secondbutton[1];
             const emoji3 = thirdbutton[1];
             
             await TicketSetup.findOneAndUpdate(
                {GuildID: guild.id},
                {
                    Channel: channel.id,
                    Category: category.id,
                    Transcripts: transcripts.id,
                    Handelers: handelers.id,
                    Everyone: everyone.id,
                    Description: description,
                    Buttons: [firstbutton[0], secondbutton[0], thirdbutton[0]]
                },
                {
                    new: true,
                    upsert: true,
                }
             );
             
             const button = new ActionRowBuilder().setComponents(
                 new ButtonBuilder().setCustomId(firstbutton[0]).setLabel(firstbutton[0]).setStyle(ButtonStyle.Danger).setEmoji(emoji1),
                 new ButtonBuilder().setCustomId(secondbutton[0]).setLabel(secondbutton[0]).setStyle(ButtonStyle.Secondary).setEmoji(emoji2),
                 new ButtonBuilder().setCustomId(thirdbutton[0]).setLabel(thirdbutton[0]).setStyle(ButtonStyle.Success).setEmoji(emoji3),
             );
             const embed = new EmbedBuilder()
             .setDescription(description)
     
             await guild.channels.cache.get(channel.id).send({
                 embeds: ([embed]),
                 components: [
                     button
                 ]
             });
     
             interaction.reply({ content: "send", ephemeral: true });
        } catch (err) {
            console.log(err);
            const errEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Moshkeli Pish Omad")
            return interaction.reply({embeds:[errEmbed], ephemeral: true}); 
        }


    }
}

