const ig = require('./instagram');
const pino = require('pino');
const configs = require('./configs')
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const { exec } = require('child_process');

(async () => {
    try {
        logger.info('===================== Starting Runner Proc =========================');
        await ig.initialize();
        await ig.login(configs.userId, configs.password);
        logger.info('===================== Login Successful =========================');
        await runHashPage();
        logger.info('===================== Ending Runner Proc =========================');
    }
    catch (err) {
        logger.error('Error in Runner Proc:: ' + err);
    }

    async function runHashPage() {
        var min = configs.minInterval;
        var max = configs.maxInterval;
        var rand = Math.floor(Math.random() * ( max - min + 1) + min);
        logger.info('===================== Selected interval: ' + rand.toString() + '=========================');
        for(var i=0;i<configs.hashTags.length;i++) {
            await ig.openHashTagPage(configs.hashTags[i], configs.noOfPostsToLike);
        }
        sendTelegramNotification();
        setTimeout(runHashPage, rand * 1000)
    }

    function sendTelegramNotification() {
        exec('sh ./telegram_send.sh "Finished running IG Script"', (err, stdout, stderr) => {
            if (err) {
              //some err occurred
              logger.error(err)
            } else {
             // the *entire* stdout and stderr (buffered)
             logger.info(`stdout: ${stdout}`);
             logger.info(`stderr: ${stderr}`);
            }
          });
    }

})();
