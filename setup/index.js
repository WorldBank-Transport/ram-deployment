'use strict';
const knex = require('knex');
const setup = require('./structure');

const arg = (a) => process.argv.indexOf(a) !== -1;

const db = knex({
  client: 'pg',
  connection: process.argv[2]
});

async function checkDangerousDbOp () {
  const exists = await db.schema.hasTable('scenarios');
  if (exists && !arg('--force-override')) {
    console.log('ERROR: Database is not empty.');
    console.log('Use --force-override if you want to delete everything.');
    process.exit(1);
  }
}

async function main () {
  try {
    if (arg('--help') || arg('-h') || process.argv.length < 3 || process.argv[2] === '--force-override') {
      console.log('Set up the RAM database with:')
      console.log('');
      console.log('  yarn setup [postgres_connection_string]');
      console.log('');
      console.log('Options:');
      console.log('  --force-override', '   Use to override safe data check.');
      console.log('                      WARNING: All data will be lost');
      console.log('');
      process.exit(0);
    }

    await checkDangerousDbOp();
    await setup.setupStructure(db);

    console.log('done');
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

main();
