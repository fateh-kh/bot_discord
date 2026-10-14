const { ApplicationCommandOptionType } = require('discord.js');
 module.exports = {
     name: 'kick',
      description: 'Kick a user from the server', 
      options: [ { name: 'user', 
        description: 'The user to kick from the server',
         type: ApplicationCommandOptionType.User, required: true } ] };
        