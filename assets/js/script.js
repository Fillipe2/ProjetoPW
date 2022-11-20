function Login() {
    var login = document.getElementById('login').value
    var senha = document.getElementById('senha').value

    if (login !== "" && senha !== ""){
        window.location.href="C:/Fillipe/S.I/projeto%20PW/formCadastro.html"
    } else {
        alert('Preencha todos os campos!')
    }

}

function apagarCampos() {
    document.getElementById('login').value = ''
    document.getElementById('senha').value = ''
}