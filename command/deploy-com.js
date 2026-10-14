require('dotenv').config();
 const { REST, Routes } = require('discord.js'); 
 const addrole = require('./addrole.js');
 const deleterole = require('./deleterole.js');
 const kick = require('./kick.js');
 const commands = [ addrole, deleterole, kick ];
 const rest = new REST({ version: '10' }) .setToken(process.env.DISCORD_TOKEN);
  (async () => { 
    try { console.log('Started refreshing application (/) commands.');
     await rest.put( Routes.applicationGuildCommands( process.env.CLIENT_ID, process.env.GUILD_ID ), { body: commands } );
      console.log('Successfully registered application commands.'); 
    } 
    catch (error) {
         console.error('Error registering commands:', error);
         }
         })();