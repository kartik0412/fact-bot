const { Telegraf } = require("telegraf");
const axios = require("axios");
const bot = new Telegraf("YOUR_TOKEN_HERE");
let maxq = 10;
let quotes = [];
getdata = async () => {
    try {
        let data = await axios.get(
            "https://spreadsheets.google.com/feeds/cells/1w8HmpRg1p5UVjXKDYni3IIMvCqSDcoe0loYGLHqsGZ4/1/public/full?alt=json"
        );
        data = data.data.feed.entry;
        quotes = [];
        data.map((q) => quotes.push(q.gs$cell.inputValue));
        maxq = Number(quotes[0]);
        console.log(maxq);
    } catch (e) {
        console.log(e);
    }
};

const startMessage = "*Inspirational Quotes Bot*\n";
const helpMessage =
    "Available Commands : \n/quote - get random quote\n/update - get refresh data\n/help - see available commands";

bot.start((ctx) => {
    getdata();
    bot.telegram.sendMessage(ctx.chat.id, startMessage + helpMessage, {
        parse_mode: "Markdown",
    });
});

bot.help((ctx) => {
    getdata();
    ctx.reply(helpMessage);
});

bot.command("update", (ctx) => {
    getdata();
    ctx.reply("Updated");
});

bot.command("quote", (ctx) => {
    let index = Math.floor(Math.random() * maxq) + 1;
    bot.telegram.sendChatAction(ctx.chat.id, "typing");
    bot.telegram.sendMessage(ctx.chat.id, `*Quote # ${index}:*\n` + "_" + quotes[index] + "_", {
        parse_mode: "Markdown",
    });
});

bot.launch();
