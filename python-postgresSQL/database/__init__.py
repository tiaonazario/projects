config = {
  "port": 5432,
  "username": "postgres",
  "password": "postgre",
  "server": "localhost",
  "database": "python-postgresql"
}

dbConfig = f"postgresql://{config['username']}:{config['password']}@{config['server']}/{config['database']}"
