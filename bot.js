/*---------------------------------------------------------------------------
	Modules
---------------------------------------------------------------------------*/
const Discord = require("discord.js"),
	  config = require("./config.json"),
	  fs = require("fs");


/*---------------------------------------------------------------------------
	Command loader
---------------------------------------------------------------------------*/
let files = fs.readdirSync("./commands/"),
	cmds = new Map();

files.forEach(f => {
	let props = require(`./commands/${f}`);
	cmds.set(props.help.name, props);

	if(props.help.aliases) {
		props.help.aliases.forEach(a => cmds.set(a, props));
	}
});


/*---------------------------------------------------------------------------
	Client
---------------------------------------------------------------------------*/
const bot = new Discord.Client({disableEveryone: true});


/*---------------------------------------------------------------------------
	Ready event
---------------------------------------------------------------------------*/
bot.on("ready", () => {
	bot.generateInvite({permissions: ["ADMINISTRATOR"]}).then(console.log);
	console.log(`Logged in as ${bot.user.tag}`);
});


/*---------------------------------------------------------------------------
	Message handler
---------------------------------------------------------------------------*/
bot.on("message", (message) => {
	if(!message.content.startsWith(config.bot.prefix)) return;
	if(message.author.bot || message.system) return;
	if(message.channel.type.toLowerCase() === "dm") return;

	if(!message.guild.me.permissionsIn(message.channel).has(["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES"])) return;
	

	/*---------------------------------------------------------------------------
		Command handler
	---------------------------------------------------------------------------*/
	let split = message.content.split(/ +/g);
	let name = split[0].slice(config.bot.prefix.length).toLowerCase();
	let args = split.slice(1);

	let cmd = cmds.get(name);
	if(cmd) cmd.run(bot, message, args);
});


/*---------------------------------------------------------------------------
	Logging in
---------------------------------------------------------------------------*/
bot.login(config.bot.token);
