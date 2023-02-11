const { Client, Events, GatewayIntentBits } = require("discord.js")
require("dotenv/config")
const { OpenAIApi, Configuration } = require("openai")

const config = new Configuration({
    apiKey: process.env.OPENAI_KEY
})

const openai = new OpenAIApi(config)

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

client.once(Events.ClientReady,(clientUser) => {
    console.log(`Logged in as ${clientUser.user.tag}`)
})

client.login(process.env.BOT_TOKEN)

const BOT_CHANNEL = "1072473616983269386"
const BOT_CHANNEL2 = "1072857977477939301"
const BOT_CHANNEL3 = "1072860713170780200"
const BOT_CHANNEL4 = "1072860834100936706"
const BOT_CHANNEL5 = "1072861258937802873"
const BOT_CHANNEL6 = "1073160665956618310"
const BOT_CHANNEL7 = "1073199104479465502"
const PAST_MESSAGES = 5

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return
    if (message.channel.id !== BOT_CHANNEL 
        && message.channel.id !== BOT_CHANNEL2
        && message.channel.id !== BOT_CHANNEL3 
        && message.channel.id !== BOT_CHANNEL4 
        && message.channel.id !== BOT_CHANNEL5
        && message.channel.id !== BOT_CHANNEL6
        && message.channel.id !== BOT_CHANNEL7) return

    message.channel.sendTyping()

    let messages = Array.from(await message.channel.messages.fetch({
        limit: PAST_MESSAGES,
        before: message.id
    }))
    messages = messages.map(m=>m[1])
    messages.unshift(message)

    let users = [...new Set([...messages.filter(m => m.member).map(m => m.member.displayName || ""), client.user.username])];

    let lastUser = users.pop()

    let prompt = `The following is a conversation betweeen ${users.join(", ")}, and ${lastUser}. \n\n`

    for (let i = messages.length - 1; i >= 0; i--) {
        const m = messages[i]
        const displayName = m.member ? m.member.displayName : "";
        prompt += `${displayName}: ${m.content}\n`
    }
    prompt += `${client.user.username}:`
    console.log("prompt:", prompt)

    const response = await openai.createCompletion({
        prompt,
        model: "text-davinci-003",
        max_tokens: 2048,
        stop: ["\n"]
    })

    console.log("response", response.data.choices[0].text)
    await message.channel.send(response.data.choices[0].text)
})

process.env.OPENAI_KEY;
process.env.BOT_TOKEN;

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
