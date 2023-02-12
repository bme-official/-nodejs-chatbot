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

const MASTER = "1073951883674259516"
const GREETINGS = "1070936693374459937"
const GRAMMAR = "1072473616983269386"
const SPEAKING = "1072857977477939301"
const READING = "1072860713170780200"
const WRITING = "1072860834100936706"
const VOCABULARY = "1072861258937802873"
const MILIA_BURGER = "1073160665956618310"
const REAL_ESTATE = "1073199104479465502"
const PAST_MESSAGES = 10

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return
    if (message.channel.id !== MASTER 
        && message.channel.id !== GREETINGS
        && message.channel.id !== GRAMMAR
        && message.channel.id !== SPEAKING
        && message.channel.id !== READING 
        && message.channel.id !== WRITING 
        && message.channel.id !== VOCABULARY
        && message.channel.id !== MILIA_BURGER
        && message.channel.id !== REAL_ESTATE) return

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
        max_tokens: 2048
    })

    console.log("response", response.data.choices[0].text)
    await message.channel.send(response.data.choices[0].text)
})

process.env.OPENAI_KEY;
process.env.BOT_TOKEN;

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
