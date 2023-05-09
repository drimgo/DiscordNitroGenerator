const config = require('./config.json');
const project = config.name;
const loadDelay = config.loadDelay;
const iterDelay = config.iterDelay;
const maxAttemps = config.attemps;

const pp = require("puppeteer");
const clc = require("cli-color");
const length = 24;
let successCodes = [];

function genURL(len){
    var password = "";
    var symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < len; i++){
        password += symbols.charAt(Math.floor(Math.random() * symbols.length));     
    }
    return password;
}

let counter = 0;
let failedCount = 0;
let successCount = 0;
async function checkNitro() {
    if (counter >= maxAttemps) {
        console.log(`[${project}][INFO] Программа отработала\n[${project}][INFO] Успешных кодов: ${successCount}\n[${project}][INFO] Неудачных кодов: ${failedCount}\nВсего: ${counter}`);
        successCodes.forEach((item, index) => {
            console.log(`[${index+1}] ${clc.green(item)}`);
        });
        clearInterval(iterInterval);
        return false;
    }
    let code = genURL(length);
    let url = `https://discord.com/gifts/${code}`;
    let isRight;
    const browser = await pp.launch({ headless: 'new'});
    const page = await browser.newPage();
    await page.goto(url);
    let loadInterval = setTimeout(() => {
        isRight = page.$eval("h1", (el) => el.innerText).then(async (result) => {
            if (result == "Некорректный подарочный код" || result == "Достаём ваш подарок из киберпространства") {
                console.log(`[${project}][${counter}] ${clc.red('URL кода')} ${url} ${clc.red('недействителен')}...`);
                await browser.close();
                failedCount++;
                return false;
            }
            else {
                console.log(`[${project}][${counter}] ${clc.green('Код')} ${url} ${clc.green('действителен')}! `);
                successCodes.push(url);
                await browser.close();
                successCount++;
                return false;
            }
        });
    }, loadDelay);
    counter++;
}

function start() {
    console.log("[" + clc.red("DiscordNitroGenerator") + "]"+" ========================================");
    console.log("[" + clc.red("DiscordNitroGenerator") + "]"+" Status:" + clc.green(" success"));
    console.log("[" + clc.red("DiscordNitroGenerator") + "]"+" Config:" + clc.green(" ./config.json"));
    console.log("[" + clc.red("DiscordNitroGenerator") + "]"+" Author: " + clc.green(config.author));
    console.log("[" + clc.red("DiscordNitroGenerator") + "]"+" Version: " + clc.green(config.version));
    console.log("[" + clc.red("DiscordNitroGenerator") + "]"+" Site: " + clc.green(config.site));
    console.log("[" + clc.red("DiscordNitroGenerator") + "] " + "Maximum attemps: " + clc.green(maxAttemps) + " times");
    console.log("[" + clc.red("DiscordNitroGenerator") + "] " + "Discord Page Refresh Time: " + clc.green(loadDelay) + " ms");
    console.log("[" + clc.red("DiscordNitroGenerator") + "] " + "Time Between Attempts: " + clc.green(iterDelay) + " ms");
    console.log("[" + clc.red("DiscordNitroGenerator") + "]"+" ========================================");
}
start();
let iterInterval = setInterval(checkNitro, iterDelay);

// check("https://discord.com/gifts/6BYPsgPePFvWaK64Ny4jaquY");
// console.log("=================");
// check("https://discord.com/gifts/BQZkjniHIAoYPInrAEIEmsms");