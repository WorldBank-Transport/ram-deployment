'use strict';
const db = require('./db/');
const setup = require('./db/structure');

const arg = (a) => process.argv.indexOf(a) !== -1;

async function checkDangerousDbOp () {
  const exists = await db.schema.hasTable('scenarios');
  if (exists && !arg('--force-override')) {
    console.log('ERROR: Database is not empty.');
    console.log('Use --force-override if you want to delete everything.');
    process.exit(1);
  }
}

async function main (params) {
  try {
    if (arg('--help') || arg('-h') || !arg('--db')) {
      console.log('Options:');
      console.log('  --db', '       Sets up database without data fixtures.');
      console.log('');
      console.log('  --force-override', '   Use to override safe data check.');
      console.log('                      WARNING: All data will be lost');
      console.log('');
      process.exit(0);
    }

    if (arg('--db')) {
      await checkDangerousDbOp();
      await setup.setupStructure();
    }

    console.log('done');
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

main();
