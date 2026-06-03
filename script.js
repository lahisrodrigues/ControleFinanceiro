const caixaVerde = document.querySelector('.btn-receita')

caixaVerde.addEventListener('click', function(){
    const descricaodigitada = document.querySelector('#input-descricao'). value;
    if (descricaodigitada === ''){
        alert('Digite a descrição, campo obrigatório!')
        return
    }
        
    fetch("http://127.0.0.1:8000/transacoes", {
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            descricao: descricaodigitada,
            valor: document.querySelector('#input-valor').value,
            tipo: document.querySelector('#input-categoria').value
        })
    })
    .then(resposta => resposta.json())
    .then(dados => {
    document.querySelector('#input-descricao').value = '';
    document.querySelector('#input-valor').value = '';
    carregarTransacoes();
    })

})

const caixaVermelha = document.querySelector('.btn-despesa')

caixaVermelha.addEventListener('click', function(){
    const descricaodigitada = document.querySelector('#input-descricao'). value;
    if (descricaodigitada === ''){
        alert('Digite a descrição, campo obrigatório!')
        return
    }    

    fetch("http://127.0.0.1:8000/transacoes", {
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            descricao: descricaodigitada,
            valor: document.querySelector('#input-valor').value,
            tipo: document.querySelector('#input-categoria').value
        })
    })
    .then(resposta => resposta.json())
    .then(dados => {
    document.querySelector('#input-descricao').value = '';
    document.querySelector('#input-valor').value = '';
    carregarTransacoes();  
    })    
})

function carregarTransacoes(){
    fetch("http://127.0.0.1:8000/transacoes")
        .then(resposta => resposta.json())
        .then(dados => {
            console.log(dados)

            const caixaReceitas = document.querySelector('.lista-receitas')
            caixaReceitas.innerHTML = '<h4>Todas as Receitas</h4>'
            const caixaDespesas = document.querySelector('.lista-despesas')
            caixaDespesas.innerHTML = '<h4>Todas as Despesas</h4>'
            dados.transacoes.forEach(item =>{
            if(item.tipo === 'salario' || item.tipo === 'adiantamento'){
                caixaReceitas.innerHTML += `<p>${item.descricao} : ${item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} <button onclick="deletarTransacao(${item.id})">❌</button></p>`;
            } else{
                caixaDespesas.innerHTML += `<p>${item.descricao} : ${item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} <button onclick="deletarTransacao(${item.id})">❌</button></p>`;
            }
});
            const caixaTotal = document.querySelector('.barra-total')
            let corDaLetra = 'green';
            if (dados.saldo_atual < 0){
                corDaLetra = 'red';
            }
            caixaTotal.innerHTML = `<h2 style="color: ${corDaLetra}">Total Final: ${dados.saldo_atual.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</h2>`
        })
}

carregarTransacoes();

function deletarTransacao(id){
    fetch(`http://127.0.0.1:8000/transacoes/${id}`, {
        method: "DELETE"
    })
    .then(resposta => resposta.json())
    .then(dados => {
        carregarTransacoes();
    }
    )
}
