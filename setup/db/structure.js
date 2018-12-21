'use strict';
const db = require('./');
const config = require('../config');

const DEBUG = config.debug;

exports.dropProjects = function () {
  DEBUG && console.log('Dropping table: projects');
  return db.schema.dropTableIfExists('projects');
}

exports.dropProjectsFiles = function () {
  DEBUG && console.log('Dropping table: projects_files');
  return db.schema.dropTableIfExists('projects_files');
}

exports.dropProjectsAA = function () {
  DEBUG && console.log('Dropping table: projects_aa');
  return db.schema.dropTableIfExists('projects_aa');
}

exports.dropScenarios = function () {
  DEBUG && console.log('Dropping table: scenarios');
  return db.schema.dropTableIfExists('scenarios');
}

exports.dropScenariosFiles = function () {
  DEBUG && console.log('Dropping table: scenarios_files');
  return db.schema.dropTableIfExists('scenarios_files');
}

exports.dropScenariosSettings = function () {
  DEBUG && console.log('Dropping table: scenarios_settings');
  return db.schema.dropTableIfExists('scenarios_settings');
}

exports.dropOperations = function () {
  DEBUG && console.log('Dropping table: operations');
  return db.schema.dropTableIfExists('operations');
}

exports.dropOperationsLogs = function () {
  DEBUG && console.log('Dropping table: operations_logs');
  return db.schema.dropTableIfExists('operations_logs');
}

exports.dropResults = function () {
  DEBUG && console.log('Dropping table: results');
  return db.schema.dropTableIfExists('results');
}

exports.dropResultsPoi = function () {
  DEBUG && console.log('Dropping table: results_poi');
  return db.schema.dropTableIfExists('results_poi');
}

exports.dropProjectsOrigins = function () {
  DEBUG && console.log('Dropping table: projects_origins');
  return db.schema.dropTableIfExists('projects_origins');
}

exports.dropProjectsOriginsIndicators = function () {
  DEBUG && console.log('Dropping table: projects_origins_indicators');
  return db.schema.dropTableIfExists('projects_origins_indicators');
}

exports.dropProjectsSourceData = function () {
  DEBUG && console.log('Dropping table: projects_source_data');
  return db.schema.dropTableIfExists('projects_source_data');
}

exports.dropScenariosSourceData = function () {
  DEBUG && console.log('Dropping table: scenarios_source_data');
  return db.schema.dropTableIfExists('scenarios_source_data');
}

exports.dropWbCatalogResources = function () {
  DEBUG && console.log('Dropping table: wbcatalog_resources');
  return db.schema.dropTableIfExists('wbcatalog_resources');
}

exports.createProjectsTable = function () {
  DEBUG && console.log('Creating table: projects');
  return db.schema.createTable('projects', table => {
    table.increments('id').primary();
    table.string('name');
    table.text('description');
    table.string('status');
    table.json('bbox');
    table.timestamps();

    table.unique('name');
  });
}

exports.createProjectsFilesTable = function () {
  DEBUG && console.log('Creating table: projects_files');
  return db.schema.createTable('projects_files', table => {
    table.increments('id').primary();
    table.string('name');
    table.string('type');
    table.string('path');
    table.integer('project_id').unsigned();
    table.foreign('project_id')
      .references('projects.id')
      .onDelete('CASCADE');
    table.json('data');
    table.timestamps();
  });
}

exports.createProjectsAATable = function () {
  DEBUG && console.log('Creating table: projects_aa');
  return db.schema.createTable('projects_aa', table => {
    table.increments('id').primary();
    table.string('name');
    table.string('type');
    table.json('geometry');
    table.integer('project_id').unsigned();
    table.foreign('project_id')
      .references('projects.id')
      .onDelete('CASCADE');
  });
}

exports.createScenariosTable = function () {
  DEBUG && console.log('Creating table: scenarios');
  return db.schema.createTable('scenarios', table => {
    table.increments('id').primary();
    table.string('name');
    table.text('description');
    table.string('status');
    table.boolean('master').defaultTo(false);
    table.integer('project_id').unsigned();
    table.foreign('project_id')
      .references('projects.id')
      .onDelete('CASCADE');
    table.json('admin_areas');
    table.timestamps();

    table.unique(['project_id', 'name']);
  });
}

exports.createScenariosFilesTable = function () {
  DEBUG && console.log('Creating table: scenarios_files');
  return db.schema.createTable('scenarios_files', table => {
    table.increments('id').primary();
    table.string('name');
    table.string('type');
    table.string('subtype');
    table.string('path');
    table.integer('project_id').unsigned();
    table.foreign('project_id')
      .references('projects.id')
      .onDelete('CASCADE');
    table.integer('scenario_id').unsigned();
    table.foreign('scenario_id')
      .references('scenarios.id')
      .onDelete('CASCADE');
    table.timestamps();
  });
}

exports.createScenariosSettingsTable = function () {
  DEBUG && console.log('Creating table: scenarios_settings');
  return db.schema.createTable('scenarios_settings', table => {
    table.string('key');
    table.text('value');
    table.integer('scenario_id').unsigned();
    table.foreign('scenario_id')
      .references('scenarios.id')
      .onDelete('CASCADE');
    table.timestamps();
    table.primary(['scenario_id', 'key']);
  });
}

exports.createOperationsTable = function () {
  DEBUG && console.log('Creating table: operations');
  return db.schema.createTable('operations', table => {
    table.increments('id').primary();
    table.string('name');
    table.integer('project_id').unsigned();
    table.foreign('project_id')
      .references('projects.id')
      .onDelete('CASCADE');
    table.integer('scenario_id').unsigned();
    table.foreign('scenario_id')
      .references('scenarios.id')
      .onDelete('CASCADE');
    table.string('status');
    table.timestamps();
  });
}

exports.createOperationsLogsTable = function () {
  DEBUG && console.log('Creating table: operations_logs');
  return db.schema.createTable('operations_logs', table => {
    table.increments('id').primary();
    table.integer('operation_id').unsigned();
    table.foreign('operation_id')
      .references('operations.id')
      .onDelete('CASCADE');
    table.string('code');
    table.json('data');
    table.timestamp('created_at').defaultTo(db.fn.now());
  });
}

exports.createResultsTable = function () {
  DEBUG && console.log('Creating table: results');
  return db.schema.createTable('results', table => {
    table.increments('id').primary();
    table.integer('project_id').unsigned();
    table.foreign('project_id')
      .references('projects.id')
      .onDelete('CASCADE');
    table.integer('scenario_id').unsigned();
    table.foreign('scenario_id')
      .references('scenarios.id')
      .onDelete('CASCADE');
    table.integer('origin_id').unsigned();
    table.foreign('origin_id')
      .references('projects_origins.id')
      .onDelete('CASCADE');
    table.integer('project_aa_id').unsigned();
    table.foreign('project_aa_id')
      .references('projects_aa.id')
      .onDelete('CASCADE');
  });
}

exports.createResultsPoiTable = function () {
  DEBUG && console.log('Creating table: results_poi');
  return db.schema.createTable('results_poi', table => {
    table.increments('id').primary();
    table.integer('result_id').unsigned();
    table.foreign('result_id')
      .references('results.id')
      .onDelete('CASCADE');
    table.string('type');
    table.integer('time');
  });
}

exports.createProjectsOriginsTable = function () {
  DEBUG && console.log('Creating table: projects_origins');
  return db.schema.createTable('projects_origins', table => {
    table.increments('id').primary();
    table.integer('project_id').unsigned();
    table.foreign('project_id')
      .references('projects.id')
      .onDelete('CASCADE');
    table.string('name');
    table.json('coordinates');
    table.index('project_id');
  });
}

exports.createProjectsOriginsIndicatorsTable = function () {
  DEBUG && console.log('Creating table: projects_origins_indicators');
  return db.schema.createTable('projects_origins_indicators', table => {
    table.increments('id').primary();
    table.integer('origin_id').unsigned();
    table.foreign('origin_id')
      .references('projects_origins.id')
      .onDelete('CASCADE');
    table.string('key');
    table.string('label');
    table.integer('value');
    table.index('origin_id');
  });
}

exports.createProjectsSourceData = function () {
  DEBUG && console.log('Creating table: projects_source_data');
  return db.schema.createTable('projects_source_data', table => {
    table.increments('id').primary();
    table.integer('project_id').unsigned();
    table.foreign('project_id')
      .references('projects.id')
      .onDelete('CASCADE');
    table.string('name');
    table.string('type');
    table.json('data');
  });
}

exports.createScenariosSourceData = function () {
  DEBUG && console.log('Creating table: scenarios_source_data');
  return db.schema.createTable('scenarios_source_data', table => {
    table.increments('id').primary();
    table.integer('project_id').unsigned();
    table.foreign('project_id')
      .references('projects.id')
      .onDelete('CASCADE');
    table.integer('scenario_id').unsigned();
    table.foreign('scenario_id')
      .references('scenarios.id')
      .onDelete('CASCADE');
    table.string('name');
    table.string('type');
    table.json('data');
  });
}

exports.createWbCatalogResources = function () {
  DEBUG && console.log('Creating table: wbcatalog_resources');
  return db.schema.createTable('wbcatalog_resources', table => {
    table.increments('id').primary();
    table.string('type');
    table.string('name');
    table.timestamp('created_at').defaultTo(db.fn.now());
    table.string('resource_id');
    table.string('resource_url');
    table.json('data');
  });
}

exports.setupStructure = function () {
  return dropScenariosFiles()
  .then(() => dropProjectsFiles())
  .then(() => dropResultsPoi())
  .then(() => dropResults())
  .then(() => dropProjectsAA())
  .then(() => dropOperationsLogs())
  .then(() => dropOperations())
  .then(() => dropScenariosSettings())
  .then(() => dropScenariosSourceData())
  .then(() => dropScenarios())
  .then(() => dropProjectsSourceData())
  .then(() => dropProjectsOriginsIndicators())
  .then(() => dropProjectsOrigins())
  .then(() => dropProjects())
  .then(() => dropWbCatalogResources())
  .then(() => createProjectsTable())
  .then(() => createProjectsAATable())
  .then(() => createScenariosTable())
  .then(() => createScenariosSettingsTable())
  .then(() => createOperationsTable())
  .then(() => createOperationsLogsTable())
  .then(() => createProjectsFilesTable())
  .then(() => createScenariosFilesTable())
  .then(() => createProjectsOriginsTable())
  .then(() => createProjectsOriginsIndicatorsTable())
  .then(() => createResultsTable())
  .then(() => createResultsPoiTable())
  .then(() => createScenariosSourceData())
  .then(() => createProjectsSourceData())
  .then(() => createWbCatalogResources());
}
