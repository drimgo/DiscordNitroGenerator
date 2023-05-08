const config = require('./config.json');
const project = config.name;
const loadDelay = config.loadDelay;
const iterDelay = config.iterDelay;
const maxAttemps = config.attemps;

const pp = require("puppeteer");
const length = 24;

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
            if (result == "Некорректный подарочный код") {
                console.log(`[${project}][${counter}] URL кода ${url} недействителен...`);
                await browser.close();
                failedCount++;
                return false;
            }
            else {
                console.log(`[${project}][${counter}] Код ${url} действителен! `);
                await browser.close();
                successCount++;
                return false;
            }
        });
    }, loadDelay);
    counter++;
}


let iterInterval = setInterval(checkNitro, iterDelay);

// check("https://discord.com/gifts/6BYPsgPePFvWaK64Ny4jaquY");
// console.log("=================");
// check("https://discord.com/gifts/BQZkjniHIAoYPInrAEIEmsms");