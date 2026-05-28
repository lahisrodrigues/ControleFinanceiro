const caixaVerde = document.querySelector('.btn-receita')

caixaVerde.addEventListener('click', function(){
    fetch("http://127.0.0.1:8000/transacoes", {
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            descricao: document.querySelector('#input-descricao').value,
            valor: document.querySelector('#input-valor').value,
            tipo: document.querySelector('#input-categoria').value
        })
    })
})

const caixaVermelha = document.querySelector('.btn-despesa')

caixaVermelha.addEventListener('click', function(){
    fetch("http://127.0.0.1:8000/transacoes", {
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            descricao: document.querySelector('#input-descricao').value,
            valor: document.querySelector('#input-valor').value,
            tipo: document.querySelector('#input-categoria').value
        })
    })
})

// Limpando as caixinhas após o envio
document.querySelector('#input-descricao').value = '';
document.querySelector('#input-valor').value = '';
// Retorna a categoria para a primeira opção
document.querySelector('#input-categoria').value = '';

function carregarTransacoes(){
    fetch("http://127.0.0.1:8000/transacoes")
        .then(resposta => resposta.json())
        .then(dados => {
            console.log(dados)
        })
}
carregarTransacoes();