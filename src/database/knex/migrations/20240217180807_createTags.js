exports.up = knex => knex.schema.createTable("tags", table => {
  table.increments("id").primary();

  table.integer("movie_id").references("id").inTable("movies").onDelete("CASCADE").notNullable();
  table.integer("user_id").references("id").inTable("users").onDelete("CASCADE").notNullable();
  
  table.varchar("name").notNullable();
  
  table.timestamp("created_at").default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("tags");

// Updated version