import dotenv


from dotenv import load_dotenv
import os

load_dotenv(".env")

data = {
  "port": os.environ["VAR_PORT"],
  "username": os.environ["VAR_USERNAME"],
  "password": os.environ["VAR_PASSWORD"],
  "server": os.environ["VAR_SERVER"],
  "database": os.environ["VAR_DATABASE"]
}

dbConfig = f"postgresql://{data['username']}:{data['password']}@{data['server']}/{data['database']}"
