require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
//const embed = require('./embed.js');
const {  zonedsheet } = require('./test.js');


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// =========================
// GLOBAL ERROR HANDLERS
// These stop the bot from crashing silently on
// unexpected errors, network blips, or rejected promises.
// =========================
client.on('error', (err) => {
    console.error('Client error:', err);
});

client.on('shardError', (err) => {
    console.error('Shard error:', err);
});

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled promise rejection:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
});

client.once('ready', () => {
    console.log(`Bot is online as ${client.user.tag}`);
});

const ALLOWED_ROLES = [
    '1542619061161037875',
    '1542619101149667338',
    '1542619016533774447'
];

client.on('interactionCreate', async interaction => {

    if (!interaction.isChatInputCommand()) return;

    // Wrap the ENTIRE handler in try/catch so nothing
    // thrown anywhere (not just in the Discord API calls)
    // can crash the process or hang the interaction.
    try {

        // =========================
        // ADD ROLE
        // =========================
        if (interaction.commandName === 'addrole') {

            await interaction.deferReply({ ephemeral: true });

            const executor = interaction.member;
            const user = interaction.options.getMember('user');
            const role = interaction.options.getRole('role');

            if (!user || !role) {
                return interaction.editReply({
                    content: '❌ User or role was not found.'
                });
            }

            // Check P / VP / HR
            const isAllowed = ALLOWED_ROLES.some(roleId =>
                executor.roles.cache.has(roleId)
            );

            if (!isAllowed) {
                return interaction.editReply({
                    content: '❌ You do not have permission to use this command.'
                });
            }

            // Check executor role hierarchy
            if (role.position >= executor.roles.highest.position) {
                return interaction.editReply({
                    content: '❌ You cannot give a role equal to or higher than your highest role.'
                });
            }

            // Check bot role hierarchy
            const botMember = interaction.guild.members.me;

            if (role.position >= botMember.roles.highest.position) {
                return interaction.editReply({
                    content: '❌ I cannot give this role because it is higher than my highest role.'
                });
            }

            // Check if user already has role
            if (user.roles.cache.has(role.id)) {
                return interaction.editReply({
                    content: `❌ ${user} already has the ${role} role.`
                });
            }

            console.log(`Adding ${role.name} to ${user.user.tag}...`);

            await user.roles.add(role);

            return interaction.editReply({
                content: `✅ Successfully added ${role} to ${user}.`
            });
        }

        // =========================
        // DELETE ROLE
        // =========================
        if (interaction.commandName === 'deleterole') {

            await interaction.deferReply({ ephemeral: true });

            const executor = interaction.member;
            const user = interaction.options.getMember('user');
            const role = interaction.options.getRole('role');

            if (!user || !role) {
                return interaction.editReply({
                    content: '❌ User or role was not found.'
                });
            }

            // Check P / VP / HR
            const isAllowed = ALLOWED_ROLES.some(roleId =>
                executor.roles.cache.has(roleId)
            );

            if (!isAllowed) {
                return interaction.editReply({
                    content: '❌ You do not have permission to use this command.'
                });
            }

            // Check executor role hierarchy
            if (role.position >= executor.roles.highest.position) {
                return interaction.editReply({
                    content: '❌ You cannot remove a role equal to or higher than your highest role.'
                });
            }

            // Check bot role hierarchy
            const botMember = interaction.guild.members.me;

            if (role.position >= botMember.roles.highest.position) {
                return interaction.editReply({
                    content: '❌ I cannot remove this role because it is higher than my highest role.'
                });
            }

            // Check if user has role
            if (!user.roles.cache.has(role.id)) {
                return interaction.editReply({
                    content: `❌ ${user} does not have the ${role} role.`
                });
            }

            console.log(`Removing ${role.name} from ${user.user.tag}...`);

            await user.roles.remove(role);

            return interaction.editReply({
                content: `✅ Successfully removed ${role} from ${user}.`
            });
        }

        // =========================
        // KICK USER
        // =========================
        if (interaction.commandName === 'kick') {

            await interaction.deferReply({ ephemeral: true });

            const executor = interaction.member;
            const user = interaction.options.getMember('user');

            if (!user) {
                return interaction.editReply({
                    content: '❌ User not found.'
                });
            }

            // Check P / VP / HR
            const isAllowed = ALLOWED_ROLES.some(roleId =>
                executor.roles.cache.has(roleId)
            );

            if (!isAllowed) {
                return interaction.editReply({
                    content: '❌ You do not have permission to use this command.'
                });
            }

            // Check executor role hierarchy
            if (user.roles.highest.position >= executor.roles.highest.position) {
                return interaction.editReply({
                    content: '❌ You cannot kick a user with a role equal to or higher than your highest role.'
                });
            }

            // Check bot role hierarchy
            const botMember = interaction.guild.members.me;

            if (user.roles.highest.position >= botMember.roles.highest.position) {
                return interaction.editReply({
                    content: '❌ I cannot kick this user because their role is higher than my highest role.'
                });
            }

            console.log(`Kicking ${user.user.tag} from the server...`);

            await user.kick();

            return interaction.editReply({
                content: `✅ Successfully kicked ${user}.`
            });
        }

    } catch (error) {

        console.error(`Error handling command "${interaction.commandName}":`, error);

        // Reply appropriately depending on interaction state,
        // and never let a failed error-reply throw further.
        try {
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({
                    content: '❌ Something went wrong while running this command.'
                });
            } else {
                await interaction.reply({
                    content: '❌ Something went wrong while running this command.',
                    ephemeral: true
                });
            }
        } catch (replyError) {
            console.error('Failed to send error reply:', replyError);
        }
    }
});

client.login(process.env.DISCORD_TOKEN)
    .catch(error => {
        console.error('Login failed:', error);
    });
    //============================================================================================================
   

//==========================================================================================
client.once('ready', async () => {
    console.log(`Bot is online as ${client.user.tag}`);
    const guildId = process.env.GUILD_ID;

    try {
        const guild = await client.guilds.fetch(guildId);
        await zonedsheet(guild);
        console.log('Role update operation completed.');
    } catch (error) {
        console.error('Role update operation failed:', error);
    }
});