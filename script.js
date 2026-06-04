let idEmEdicao = null;

const caixaVerde = document.querySelector('.btn-receita')

caixaVerde.addEventListener('click', function(){
    const descricaoDigitada = document.querySelector('#input-descricao').value;
    if (descricaoDigitada === ''){
        alert('Digite a descrição, campo obrigatório!')
        return
    }

    const valorDigitado = Number(document.querySelector('#input-valor').value);
    if (valorDigitado <= 0 || isNaN(valorDigitado)) {
        alert('Erro: Valor inválido! Digite um número maior que zero.')
        return
    }

    let urlCerta = "http://127.0.0.1:8000/transacoes";
    let metodoCerto = "POST";
    if (idEmEdicao !== null){
        urlCerta = `http://127.0.0.1:8000/transacoes/${idEmEdicao}`
        metodoCerto = "PUT"
    }
        
    fetch(urlCerta, {method: metodoCerto, headers: {"Content-Type": "application/json"}, body: JSON.stringify({
            descricao: descricaoDigitada,
            valor: valorDigitado,
            tipo: document.querySelector('#input-categoria').value
        })
    })
    .then(resposta => resposta.json())
    .then(dados => {
    idEmEdicao = null
    document.querySelector('#input-descricao').value = '';
    document.querySelector('#input-valor').value = '';
    carregarTransacoes();
    })

})

const caixaVermelha = document.querySelector('.btn-despesa')

caixaVermelha.addEventListener('click', function(){
    const descricaoDigitada = document.querySelector('#input-descricao'). value;
    if (descricaoDigitada === ''){
        alert('Digite a descrição, campo obrigatório!')
        return
    }
    const valorDigitado = Number(document.querySelector('#input-valor').value);
    if (valorDigitado <= 0 || isNaN(valorDigitado)) {
        alert('Erro: Valor inválido! Digite um número maior que zero.')
        return
    }
    
    let urlCerta = "http://127.0.0.1:8000/transacoes";
    let metodoCerto = "POST";
    if (idEmEdicao !== null){
        urlCerta = `http://127.0.0.1:8000/transacoes/${idEmEdicao}`
        metodoCerto = "PUT"
    }

    fetch(urlCerta, {method: metodoCerto,headers: {"Content-Type": "application/json"}, body: JSON.stringify({
            descricao: descricaoDigitada,
            valor: valorDigitado,
            tipo: document.querySelector('#input-categoria').value
        })
    })
    .then(resposta => resposta.json())
    .then(dados => {
    idEmEdicao = null;
    document.querySelector('#input-descricao').value = '';
    document.querySelector('#input-valor').value = '';
    carregarTransacoes();  
    })    
})

function carregarTransacoes(filtro = 'todos'){
    fetch("http://127.0.0.1:8000/transacoes")
        .then(resposta => resposta.json())
        .then(dados => {
            let listaFiltrada = dados.transacoes;
            if (filtro === 'receitas'){
                listaFiltrada = dados.transacoes.filter(item => item.tipo ==='salario' || item.tipo === 'adiantamento');
            }
            else if ( filtro === 'despesas'){
                listaFiltrada = dados.transacoes.filter(item => item.tipo !== 'salario' && item.tipo !== 'adiantamento' )  
            }
            console.log(dados)

            const caixaReceitas = document.querySelector('.lista-receitas')
            caixaReceitas.innerHTML = '<h4>Todas as Receitas</h4>'
            const caixaDespesas = document.querySelector('.lista-despesas')
            caixaDespesas.innerHTML = '<h4>Todas as Despesas</h4>'
            listaFiltrada.forEach(item =>{
            if(item.tipo === 'salario' || item.tipo === 'adiantamento'){
                caixaReceitas.innerHTML += `<p>${item.descricao} : ${item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} <button onclick="deletarTransacao(${item.id})">❌</button><button onclick="prepararEdicao(${item.id}, '${item.descricao}', ${item.valor}, '${item.tipo}')">✏️</button></p>`;
            } else{
                caixaDespesas.innerHTML += `<p>${item.descricao} : ${item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} <button onclick="deletarTransacao(${item.id})">❌</button><button onclick="prepararEdicao(${item.id}, '${item.descricao}', ${item.valor}, '${item.tipo}')">✏️</button></p>`;
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

function prepararEdicao(id, descricao, valor, tipo){
    idEmEdicao = id
    document.querySelector('#input-descricao').value = descricao
    document.querySelector('#input-valor').value = valor 
    document.querySelector('#input-categoria').value = tipo

}