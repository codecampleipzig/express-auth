
exports.up = async function (knex) {
  await knex.schema.createTable('users', (table) => {
    table.increments()
    table.string('email').unique().notNullable()
    table.string('hashedPassword').notNullable()
    table.timestamps(false, true)
  })
  await knex.schema.createTable('posts', (table) => {
    table.increments()
    table.string('title').notNullable()
    table.text('content').notNullable()
    table.integer('userId').unsigned().notNullable().references('users.id').onDelete('CASCADE')
    table.timestamps(false, true)
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('posts')
  await knex.schema.dropTable('users')
}
