// Banco
var request, db

function iniciandoBanco() {
    request = indexedDB.open("FinancasDB", 1)

    request.onupgradeneeded = function (event) {
        db = event.target.result;
        var Financas = db.createObjectStore("Financas", { keyPath: "id", autoIncrement: true });
        Financas.add({ campo: 'Valor 1' });
        //armazena.createIndex("nome", "nome", { unique: false })
    }

    request.onsuccess = function (event) {
        db = event.target.result

        //Registros()
    }

    request.onerror = function (event) {
        console.log("Erro ao criar/abrir o banco de dados. Erro: " + event.target.error)
    }
}


function inserir() {
    let nome = document.getElementById('nome').value
    var dados = {
        nome: `${nome}`
    }

    var transaction = db.transaction('Financas', "readwrite")

    transaction.oncomplete = function (event) {
        console.log('Transação finalizada com sucesso.')
    }

    transaction.onerror = function (event) {
        console.log('Transação finalizada com erro. Erro: ' + event.target.error)
    }

    var tbFinancas = transaction.objectStore('Financas')

    var inserir = tbFinancas.add(dados)
    inserir.onerror = function (event) {
        console.log('Ocorreu um erro ao salvar o contato.')
    }

    inserir.onsuccess = function (event) {
        console.log('Contato salvo com sucesso.')
        //buscarRegistros()
    }
}


function alterar(id){
    console.log(id, Number(id))

    var transaction = db.transaction('Financas', 'readwrite')

    transaction.oncomplete = function (event) {
        console.log('Transação finalizada com sucesso.')
    }

    // Quando ocorre algum erro na transação
    transaction.onerror = function (event) {
        console.log('Transação finalizada com erro. Erro: ' + event.target.error)
    }

    var tbFinancas = transaction.objectStore('Financas')
    request = tbFinancas.get(Number(id))

    request.onerror = function (event) {
        console.log('Ocorreu um erro ao buscar o contato.')
    }

    request.onsuccess = function (event) {
        var Financas = event.target.result

        let nome = document.getElementById('nome').value

        Financas.nome = `${nome}`
   
        //Atualizando o registro no banco
        var requestUpdate = tbFinancas.put(Financas)

        //quando ocorrer erro ao atualizar o registro
        requestUpdate.onerror = function (event) {
            console.log('Ocorreu um erro ao salvar o contato.')
        }

        //quando o registro for atualizado com sucesso
        requestUpdate.onsuccess = function (event) {
            console.log('Contato salvo com sucesso.')
            buscarRegistrosIDB()
        }
    }
}