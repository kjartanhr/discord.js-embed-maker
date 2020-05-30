const Discord = require('discord.js');
const client = new Discord.Client();
const colours = require('colors');

const fs = require('fs');
const fileName = './config.json';
const file = require(fileName);

colours.setTheme({ 
    info: 'green',
    help: 'cyan',
    warn: 'yellow',
    success: 'blue',
    error: 'red'
});

client.on('ready', () => {
    console.log('Logged in successfully.'.info);
});
  
client.on('message', message => {
    var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
    var prefix = config.prefix;
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (command === config.embedCommand) {
        if (!args.length) {
            return message.channel.send(config.errormsg);
        }
        else {
            if (message.member.roles.cache.find(r => r.name === config.adminRole)) {
                const createdEmbed = new Discord.MessageEmbed()
                .setDescription(args.join(' '))
                .setFooter(config.footer);
            
                message.channel.send(createdEmbed);
                message.delete();
                console.log('Embed maker utility v1. >> '.info+'Created embed with contents: '+args.join(' ').yellow);
            }
            else {
                message.channel.send(":x: You do not have permission to use this command.");
            }
        }
    }
    else if (command === "setprefix") {
        if (!args.length) {
            return message.channel.send(config.errormsg);
        }
        else {
            if (message.member.roles.cache.find(r => r.name === config.adminRole)) {
                file.prefix = args.join('');
    
                fs.writeFile(fileName, JSON.stringify(file, null, 2), function writeJSON(err) {
                if (err) return console.log(err);
                    console.log("Configuration updated successfully.".info)
                });
                message.channel.send(":white_check_mark: Prefix updated successfully to `"+args.join('')+"`");
            }
            else {
                message.channel.send(":x: You do not have permission to use this command.");
            }
        }
    }
    else if (command === "setfooter") {
        if (!args.length) {
            return message.channel.send(config.errormsg);
        }
        else {
            if (message.member.roles.cache.find(r => r.name === config.adminRole)) {
                file.footer = args.join(' ');
    
                fs.writeFile(fileName, JSON.stringify(file, null, 2), function writeJSON(err) {
                if (err) return console.log(err);
                    console.log("Configuration updated successfully.".info)
                });
                message.channel.send(":white_check_mark: Footer updated successfully to `"+args.join(' ')+"`");
            }
            else {
                message.channel.send(":x: You do not have permission to use this command.");
            }
        }
    }
});

var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
client.login(config.token);