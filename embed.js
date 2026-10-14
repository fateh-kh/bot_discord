// Posted by shockpast
// Retrieved 2026-08-31, License - CC BY-SA 4.0
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const path = require('path');

module.exports = {
    name: 'newmember',
    once: true,
    run: async (client) => {
        client.on('guildMemberAdd', member => {
            try {
                const channel = member.guild.channels.cache.get(process.env.WELCOME_CHANNEL_ID);

                if (!channel) return console.log('Welcome channel not found. Check WELCOME_CHANNEL_ID in .env');

                // Adjust these paths to wherever the images actually live in your project
                const esiLogoPath = path.join(__dirname, 'esilogo.png');
                const group27Path = path.join(__dirname, 'Group_27.png');

                const esiLogoAttachment = new AttachmentBuilder(esiLogoPath, { name: 'esilogo.png' });
                const group27Attachment = new AttachmentBuilder(group27Path, { name: 'Group_27.png' });

                const exampleEmbed = new EmbedBuilder()
                    .setColor(0x1E0F2D)
                    .setTitle('Welcome to SEC 👋')
                    .setURL('https://www.instagram.com/sec.esi?igsi=MTUwem03cmhlcXFhcw==')
                    .setAuthor({ name: 'SEC ESI', iconURL: 'attachment://esilogo.png' })
                    .setDescription(`Hey there, glad you're here, ${member.user.username}!`)
                    .setThumbnail('attachment://Group_27.png')
                    .addFields(
                        { name: 'About SEC', value: 'SEC (Sport & Entertainment Club) is where ESI students come together for sports and entertainment — from Welcome Day and Chess Break to ESI Olympics and ESI Cup.' },
                        { name: '✅your roles', value: 'Take a look around, introduce yourself, and grab your roles to get notified about the events you care about.' },
                        { name: '📌 Get started', value: ' check out the roles and announcements channels' },
                    )
                    .addFields({ name: '🙋 Questions?', value: 'just ask, someone from the team will help', inline: true })
                    .setImage('attachment://Group_27.png')
                    .setTimestamp()
                    .setFooter({ text: 'Glad to have you with us!', iconURL: 'attachment://Group_27.png' });

                channel.send({
                    content: `<@${member.id}>`,
                    embeds: [exampleEmbed],
                    files: [esiLogoAttachment, group27Attachment]
                });
            } catch (e) {
                console.error(e);
            }
        });
    }
};
//===================================================================================
embed.run(client);