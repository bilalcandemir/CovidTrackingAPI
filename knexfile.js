module.exports = {
    development: {
        client: "pg",
        connection: {
            host: 'localhost',
            database: "covidtracking",
            user: "admin",
            password: "admin",
            port: '5432'
        },
        pool: {
            min: 2,
            max: 10,
          },
        migrations: {
            directory: "./data/migrations"
        },
        seeds: {
            directory: "./data/seeds"
        }
    }
}