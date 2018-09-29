module.exports.run = (bot, message, args) => {
	message.channel.send(`Hello, I am ${bot.user.tag}.`);
}

module.exports.help = {
	name: "test",
	aliases: ["test2", "test3"]
}