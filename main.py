from fastapi import FastAPI, Depends
from pydantic import BaseModel
from database import Base, engine, SessionLocal
from sqlalchemy import Column,Integer, String, Float
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

# Este é o modelo que o Banco de Dados vai usar para criar a tabela
class TransacaoDB(Base):
    __tablename__ = "transacoes" # Nome da tabela no banco de dados

    id = Column(Integer, primary_key=True, index=True) # Cada transação ganha um número único (1, 2, 3...)
    descricao = Column(String)
    valor = Column(Float)
    tipo = Column(String)

# Criamos a nossa aplicação financeira
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # O asterisco "*" significa "Permitir cartas de qualquer porta/site"
    allow_credentials=True,
    allow_methods=["*"], # Permite enviar (POST), ler (GET), deletar, etc.
    allow_headers=["*"], # Permite qualquer formato de envelope (como o nosso JSON)
)

# Esta linha lê o modelo acima e cria o arquivo de banco de dados e a tabela automaticamente!
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db # Entrega o banco para a nossa rota usar
    finally:
        db.close() # Garante que vai chegar a porta no final

# Criamos o 'molde' exato da transação (validação de dados)
class Transacao(BaseModel):
    descricao : str
    valor : float
    tipo : str 
   
# Criamos a primeira rota (o caminho do navegador)
@app.get("/")
def rota_principal():
    # A resposta que o servidor vai devolver
    return {"mensagem": "Meu Controle Financeiro está no ar!"}

@app.get("/transacoes")
# 1. Nos parênteses, pedimos apenas o assistente de conexão do banco (db)
def listar_transacoes(db: Session = Depends(get_db)):

    # 2. Logo na primeira linha, a nossa API abre o banco e busca todas as transações
    dados_do_banco = db.query(TransacaoDB).all()

    # 3. A sua lógica matemática perfeita roda em cima do que veio do banco:
    saldo = 0
    for transacao in dados_do_banco:
        if transacao.tipo == "salario" or transacao.tipo == "adiantamento":
            saldo += transacao.valor
        else:
            saldo -= transacao.valor

    return{
        "total_transacoes": len(dados_do_banco), 
        "saldo_atual": saldo,
        "transacoes": dados_do_banco
        }

@app.post("/transacoes")
def criar_transacao(transacao: Transacao, db: Session = Depends (get_db)):
    # 1. Transformamos o molde da internet (Pydantic) no molde do Banco (SQLAlchemy)
    nova_transacao = TransacaoDB(
        descricao=transacao.descricao,
        valor=transacao.valor,
        tipo=transacao.tipo
    )
    # 2. Salva no banco de dados de verdade!
    db.add(nova_transacao)
    db.commit()
    db.refresh(nova_transacao) # Pega o ID (1, 2, 3...) que o banco gerou

    return{
        "mensagem": "Transação salva para sempre!",
        "id_gerado": nova_transacao.id,
        "descricao":nova_transacao.descricao,
        "valor": nova_transacao.valor
    }


