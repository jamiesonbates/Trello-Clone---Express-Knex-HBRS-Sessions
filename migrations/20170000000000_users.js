exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments();
    table.string('username').unique().notNullable();
    table.text('h_pw');
  });
};

exports.down = function(knex, Promise) {

};
