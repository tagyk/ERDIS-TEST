
// const CronJob = require('../lib/cron.js').CronJob;

// console.log('Before job instantiation');
// let date = new Date();
// date.setSeconds(date.getSeconds()+2);
// const job = new CronJob(date, function() {
// 	const d = new Date();
// 	console.log('Specific date:', date, ', onTick at:', d);
// });
// console.log('After job instantiation');
// job.start();



// const CronJob = require('../lib/cron.js').CronJob;

// console.log('Before job instantiation');
// const job = new CronJob('0 */30 9-17 * * *', function() {
// 	const d = new Date();
// 	console.log('Every 30 minutes between 9-17:', d);
// });
// console.log('After job instantiation');
// job.start();



const CronJob = require('cron').CronJob;

console.log('Before job instantiation');
const job = new CronJob('* * * * * *', function() {
	const d = new Date();
	console.log('Every second:', d);
});
console.log('After job instantiation');
job.start();