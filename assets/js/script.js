// Banco
var request, db

function iniciandoBanco() {
    request = indexedDB.open("FinancasDB", 2)

    request.onupgradeneeded = function (event) {

        db = event.target.result

        // Adicionar os campos do banco
        var armazena = db.createObjectStore("Financas", { keyPath: "id", autoIncrement: true })

        armazena.createIndex("nome", "nome", { unique: false })

    }

    request.onsuccess = function (event) {

        db = event.target.result

        
        Registros()
    }   
}   

function inserir() {
    let nome= document.getElementById('nome').value
    

    var tabela = {
        nome: `${nome}`
    }

    var inserindo = db.transaction('Financas', "readwrite")

    var armazena = inserindo.objectStore('Financas')


}

