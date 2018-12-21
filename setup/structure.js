'use strict';

function dropProjects (db) {
  console.log('Dropping table: projects');
  return db.schema.dropTableIfExists('projects');
}

function dropProjectsFiles (db) {
  console.log('Dropping table: projects_files');
  return db.schema.dropTableIfExists('projects_files');
}

function dropProjectsAA (db) {
  console.log('Dropping table: projects_aa');
  return db.schema.dropTableIfExists('projects_aa');
}

function dropScenarios (db) {
  console.log('Dropping table: scenarios');
  return db.schema.dropTableIfExists('scenarios');
}

function dropScenariosFiles (db) {
  console.log('Dropping table: scenarios_files');
  return db.schema.dropTableIfExists('scenarios_files');
}

function dropScenariosSettings (db) {
  console.log('Dropping table: scenarios_settings');
  return db.schema.dropTableIfExists('scenarios_settings');
}

function dropOperations (db) {
  console.log('Dropping table: operations');
  return db.schema.dropTableIfExists('operations');
}

function dropOperationsLogs (db) {
  console.log('Dropping table: operations_logs');
  return db.schema.dropTableIfExists('operations_logs');
}

function dropResults (db) {
  console.log('Dropping table: results');
  return db.schema.dropTableIfExists('results');
}

function dropResultsPoi (db) {
  console.log('Dropping table: results_poi');
  return db.schema.dropTableIfExists('results_poi');
}

function dropProjectsOrigins (db) {
  console.log('Dropping table: projects_origins');
  return db.schema.dropTableIfExists('projects_origins');
}

function dropProjectsOriginsIndicators (db) {
  console.log('Dropping table: projects_origins_indicators');
  return db.schema.dropTableIfExists('projects_origins_indicators');
}

function dropProjectsSourceData (db) {
  console.log('Dropping table: projects_source_data');
  return db.schema.dropTableIfExists('projects_source_data');
}

function dropScenariosSourceData (db) {
  console.log('Dropping table: scenarios_source_data');
  return db.schema.dropTableIfExists('scenarios_source_data');
}

function dropWbCatalogResources (db) {
  console.log('Dropping table: wbcatalog_resources');
  return db.schema.dropTableIfExists('wbcatalog_resources');
}

function createProjectsTable (db) {
  console.log('Creating table: projects');
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

function createProjectsFilesTable (db) {
  console.log('Creating table: projects_files');
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

function createProjectsAATable (db) {
  console.log('Creating table: projects_aa');
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

function createScenariosTable (db) {
  console.log('Creating table: scenarios');
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

function createScenariosFilesTable (db) {
  console.log('Creating table: scenarios_files');
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

function createScenariosSettingsTable (db) {
  console.log('Creating table: scenarios_settings');
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

function createOperationsTable (db) {
  console.log('Creating table: operations');
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

function createOperationsLogsTable (db) {
  console.log('Creating table: operations_logs');
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

function createResultsTable (db) {
  console.log('Creating table: results');
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

function createResultsPoiTable (db) {
  console.log('Creating table: results_poi');
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

function createProjectsOriginsTable (db) {
  console.log('Creating table: projects_origins');
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

function createProjectsOriginsIndicatorsTable (db) {
  console.log('Creating table: projects_origins_indicators');
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

function createProjectsSourceData (db) {
  console.log('Creating table: projects_source_data');
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

function createScenariosSourceData (db) {
  console.log('Creating table: scenarios_source_data');
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

function createWbCatalogResources (db) {
  console.log('Creating table: wbcatalog_resources');
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

exports.setupStructure = function (db) {
  return dropScenariosFiles(db)
  .then(() => dropProjectsFiles(db))
  .then(() => dropResultsPoi(db))
  .then(() => dropResults(db))
  .then(() => dropProjectsAA(db))
  .then(() => dropOperationsLogs(db))
  .then(() => dropOperations(db))
  .then(() => dropScenariosSettings(db))
  .then(() => dropScenariosSourceData(db))
  .then(() => dropScenarios(db))
  .then(() => dropProjectsSourceData(db))
  .then(() => dropProjectsOriginsIndicators(db))
  .then(() => dropProjectsOrigins(db))
  .then(() => dropProjects(db))
  .then(() => dropWbCatalogResources(db))
  .then(() => createProjectsTable(db))
  .then(() => createProjectsAATable(db))
  .then(() => createScenariosTable(db))
  .then(() => createScenariosSettingsTable(db))
  .then(() => createOperationsTable(db))
  .then(() => createOperationsLogsTable(db))
  .then(() => createProjectsFilesTable(db))
  .then(() => createScenariosFilesTable(db))
  .then(() => createProjectsOriginsTable(db))
  .then(() => createProjectsOriginsIndicatorsTable(db))
  .then(() => createResultsTable(db))
  .then(() => createResultsPoiTable(db))
  .then(() => createScenariosSourceData(db))
  .then(() => createProjectsSourceData(db))
  .then(() => createWbCatalogResources(db));
}
