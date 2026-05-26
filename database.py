from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# 1. O endereço do nosso banco de dados. 
# O "./" significa "nesta mesma pasta". Ele vai criar um arquivo chamado 'meubanco.db'

SQLALCHEMY_DATABASE_URL = "sqlite:///.meubanco.db"

# 2. O 'Motor' (Engine) que faz a conexão real com o arquivo SQLite (motorista)
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# 3. A 'Sessão' é a nossa "linha telefônica" com o banco. (rádio)
# Toda vez que a API for salvar ou ler algo, ela abre uma sessão nova.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. A 'Base' é a classe mestre. (engenheurio)
# O SQLAlchemy vai usar ela para transformar nossos moldes Python em Tabelas SQL.
Base = declarative_base()


