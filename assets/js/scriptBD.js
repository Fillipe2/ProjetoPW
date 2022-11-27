var request, db, linha

function iniciandoBanco() {
    request = indexedDB.open("FinancasDB", 1)

    request.onupgradeneeded = function (event) {
        db = event.target.result;
        var Financas = db.createObjectStore("Financas", { keyPath: "id", autoIncrement: true });
        //Financas.add({ campo: 'Valor 1' });
        Financas.createIndex("mesReferencia", "mesReferencia", { unique: false })
        Financas.createIndex("id", "id", { unique: true })
    }

    request.onsuccess = function (event) {
        db = event.target.result
        buscarMesReferencia(obterMes(String(new Date().toJSON().slice(0, 10))))
        //Registros()
    }

    request.onerror = function (event) {
        console.log("Erro ao criar/abrir o banco de dados. Erro: " + event.target.error)
    }
}


function inserir(movimento) {

    let data = document.getElementById('data').value
    let valor = Number(document.getElementById('valor').value)
    let descricao = document.getElementById('descricao').value
    let parcelas = Number(document.getElementById('parcelas').value)
    let mesReferencia
    let dataAuxiliar = data

    var dados
    var transaction = db.transaction('Financas', "readwrite")

    transaction.oncomplete = function (event) {
        console.log('Transação finalizada com sucesso.')
    }

    transaction.onerror = function (event) {
        console.log('Transação finalizada com erro. Erro: ' + event.target.error)
    }

    var tbFinancas = transaction.objectStore('Financas')
    var inserir
    
    console.log(`Iniciando os registros.`)
    if (parcelas > 1) {
        valor = valor / parcelas
        for (let i = 1; i <= parcelas; i++) {
            mesReferencia = obterMes(dataAuxiliar)
            dados = { movimento: `${movimento}`, data: `${data}`, descricao: `${descricao}`, valor: `${valor}`, parcelas: `${i}/${parcelas}`, mesReferencia: `${mesReferencia}` }
            inserir = tbFinancas.add(dados)
            dataAuxiliar = dividirDataParcelas(dataAuxiliar)
        }

    } else {
        mesReferencia = obterMes(data)
        dados = { movimento: `${movimento}`, data: `${data}`, descricao: `${descricao}`, valor: `${valor}`, parcelas: `${parcelas}/${parcelas}`, mesReferencia: `${mesReferencia}` }
        inserir = tbFinancas.add(dados)
    }

    inserir.onerror = function (event) {
        console.log('Ocorreu um erro ao salvar o contato.')
    }

    inserir.onsuccess = function (event) {
        console.log('Contato salvo com sucesso.')
        buscarMesReferencia(obterMes(String(new Date().toJSON().slice(0, 10))))
    }
}


function alterar() {
    var transaction = db.transaction('Financas', 'readwrite')

    transaction.oncomplete = function (event) {
        console.log('Transação finalizada com sucesso.')
    }

    // Quando ocorre algum erro na transação
    transaction.onerror = function (event) {
        console.log('Transação finalizada com erro. Erro: ' + event.target.error)
    }

    var tbFinancas = transaction.objectStore('Financas')
    request = tbFinancas.get(Number(linha))

    request.onerror = function (event) {
        console.log('Ocorreu um erro ao buscar o contato.')
    }

    request.onsuccess = function (event) {
        console.log(request.result)
        var Financas = event.target.result

        let data = document.getElementById('data').value
        let descricao = document.getElementById('descricao').value
        let valor = document.getElementById('valor').value
        let parcelas = document.getElementById('parcelas').value

        Financas.data = `${data}`
        Financas.descricao = `${descricao}`
        Financas.valor = `${valor}`
        Financas.parcelas = `${parcelas}`

        //Atualizando o registro no banco
        var requestUpdate = tbFinancas.put(Financas)

        //quando ocorrer erro ao atualizar o registro
        requestUpdate.onerror = function (event) {
            console.log('Ocorreu um erro ao alterar o movimento.')
        }

        //quando o registro for atualizado com sucesso
        requestUpdate.onsuccess = function (event) {
            console.log('Movimento salvo com sucesso.')
            buscarMesReferencia(obterMes(String(new Date().toJSON().slice(0, 10))))
        }
    }
}

function excluir(id) {
    let row = id.parentNode.parentNode.id
    // Abrindo uma transação para ler/inserir/atualizar/excluir dados
    var transaction = db.transaction('Financas', "readwrite")

    // Quando ocorre algum erro na transação
    transaction.onerror = function (event) {
        console.log('Transação finalizada com erro. Erro: ' + event.target.error)
    }

    //Recuperando a object store para alterar os registros
    var store = transaction.objectStore('Financas')

    //Excluindo o registro pela chave primaria
    var requestDelete = store.delete(Number(row))

    //quando ocorrer um erro ao excluir o registro
    requestDelete.onerror = function (event) {
        console.log('Ocorreu um erro ao excluir o movimento.')
    }

    //quando o registro for excluído com sucesso
    requestDelete.onsuccess = function (event) {
        console.log('Movimento excluído com sucesso.')
        buscar()
    }
}

//* ******************BUSCAR*********************** */
function buscar() {
    var totalGasto = new (Number)
    var totalMovimentos = new (Number)
    //limpando o corpo da tabela
    var myTable = document.getElementById("tabela").querySelector("tbody")
    myTable.innerHTML = ''

    // Abrindo uma transação para ler dados
    var transaction = db.transaction('Financas', "readonly")

    var store = transaction.objectStore('Financas')
    request = store.openCursor()

    request.onsuccess = function (event) {
        var cursor = event.target.result
        if (cursor) {
            //console.log(cursor.value)
            //setando os campos de inserção de dados
            document.getElementById('data').value = cursor.value.data
            document.getElementById('descricao').value = cursor.value.descricao
            document.getElementById('valor').value = cursor.value.valor
            document.getElementById('parcelas').value = cursor.value.parcelas

            addToTable(cursor.value.id)
            totalGasto += Number(cursor.value.valor);
            totalMovimentos += 1;
            cursor.continue()
        }
        document.getElementById('totalGasto').innerHTML = `Total das Despesas: ${totalGasto}`;
        document.getElementById('totalMovimentos').innerHTML = `Total de Movimentos: ${totalMovimentos}`;
    }
}

function buscarMesReferencia(mesReferencia) {
    var totalGasto = new (Number)
    var totalMovimentos = new (Number)
    var myTable = document.getElementById("tabela").querySelector("tbody")
    myTable.innerHTML = ''

    var transaction = db.transaction('Financas', "readonly")
    var store = transaction.objectStore('Financas')

    var index = store.index("mesReferencia");
    var singleKeyRange = IDBKeyRange.only(mesReferencia);
    index.openCursor(singleKeyRange).onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            document.getElementById('data').value = cursor.value.data
            document.getElementById('descricao').value = cursor.value.descricao
            document.getElementById('valor').value = cursor.value.valor
            document.getElementById('parcelas').value = cursor.value.parcelas

            addToTable(cursor.value.id)
            totalGasto += Number(cursor.value.valor);
            totalMovimentos += 1;
            cursor.continue()
        }
        document.getElementById('totalGasto').innerHTML = `Total das Despesas: ${totalGasto}`;
        document.getElementById('totalMovimentos').innerHTML = `Total de Movimentos: ${totalMovimentos}`;
    };
}

//Função para adicionar uma nova linha na tabela
function addToTable(id) {
    //Definindo as variaveis e recebendo os dados
    let data = document.getElementById('data').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value
    let parcelas = document.getElementById('parcelas').value
    let tableBody = document.getElementById("tabela").querySelector("tbody")

    let tableSize = tableBody.rows.length //Calculando o tamanho da Tabela
    let row = tableBody.insertRow(tableSize) //Inserindo uma linha abaixo da Tabela
    let cell1 = row.insertCell(0)   //Inserindo as celulas da linha
    let cell2 = row.insertCell(1)   //Inserindo as celulas da linha
    let cell3 = row.insertCell(2)   //Inserindo as celulas da linha
    let cell4 = row.insertCell(3)   //Inserindo as celulas da linha
    let cell5 = row.insertCell(4)   //Inserindo as celulas da linha
    let cell6 = row.insertCell(5) //Inserindo as celulas da linha
    row.id = id                     //Adicionando o id no elemento a ser criado

    //Criando o codigo do botão para remover a linha
    let btnCode = "<button class='table-btn' onclick='updateToTable(this)'>Alterar</button>"
    btnCode += "<button class='table-btn' onclick='excluir(this)'>Remover</button>"

    //Preenchendo as celulas da linha
    cell1.innerHTML = id
    cell2.innerHTML = converteDataFormatoBR(data)
    cell3.innerHTML = descricao
    cell4.innerHTML = `R$ ${valor}`
    cell5.innerHTML = parcelas
    cell6.innerHTML = btnCode

    //Limpando os campos de inserção de dados
    document.getElementById('data').value = ""
    document.getElementById('descricao').value = ""
    document.getElementById('valor').value = ""
    document.getElementById('parcelas').value = ""

    //Retornando 'false' para impedir o reload da pagina
    return false
}

function updateToTable(id) {
    linha = id.parentNode.parentNode.id //Pegando o id do avô do botão    
    var transaction = db.transaction('Financas')

    var tbFinancas = transaction.objectStore('Financas')
    request = tbFinancas.get(Number(linha))

    request.onsuccess = function (event) {
        document.getElementById('data').value = request.result.data
        document.getElementById('descricao').value = request.result.descricao
        document.getElementById('valor').value = request.result.valor
        document.getElementById('parcelas').value = request.result.parcelas
    }

    //Retornando 'false' para impedir o reload da pagina
    return false
}

function inserirProximoIndice() {
    var transaction = db.transaction('Financas', "readonly");
    var store = transaction.objectStore('Financas');
    var index = store.index("id");

    //ordenando em ordem decrescente de id
    var request2 = index.openCursor(null, 'prev');
    request2.onsuccess = function (event) {
        var cursor = event.target.result
        if (cursor) {
            inserir(Number(cursor.key + 1))
        } else {
            inserir(Number(1))
        }
    }
}