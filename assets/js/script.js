function obterMes(data) {
    const mesNome = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    var mes = data.slice(5, 7) - 1
    return mesNome[mes];
}

function converteDataFormatoBR(data) {
    if (data != "") {
        return `${data.slice(8, 10)}/${data.slice(5, 7)}/${data.slice(0, 4)}`;
    }
}

function converteDataFormatoEN(data) {
    if (data != "") {
        return(`${data.slice(6)}-${data.slice(3, 5)}-${data.slice(0, 2)}`)
    }
}

function dividirDataParcelas(data) {
    var dia = new Number()
    var mes = new Number()
    var ano = new Number()

    if (data != "") {
        dia = data.slice(8, 10)
        mes = parseInt(data.slice(5, 7), 10)
        ano = parseInt(data.slice(0, 4), 10)

        mes = mes + 1
        if (mes > 12){
            mes = String("01")
            ano = ano + 1
        }

        if (String(dia).length == 1){
            String(dia = "0" + dia)
        }

        if (String(mes).length == 1){
            String(mes = "0" + mes)
        }

        return `${ano}-${mes}-${dia}`
    }
}