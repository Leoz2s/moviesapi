exports.up = knex => knex.schema.createTable("movies", table => {
  table.increments("id").primary();
  table.varchar("title").notNullable();
  table.varchar("description");
  table.integer("rating");

  table.integer("user_id").references("id").inTable("users").onDelete("CASCADE").notNullable();

  table.timestamp("created_at").default(knex.fn.now());
  table.timestamp("updated_at").default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("movies");

// Updated version
