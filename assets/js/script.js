function obterMes(data) {
    objData = DataJson(data)

    const mesNome = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    objData.mes = parseInt(objData.mes) - 1
    dataReferencia = data
    document.getElementById('mes').innerHTML = `${mesNome[objData.mes]} - ${data.slice(0, 4)}`
    return (`${mesNome[objData.mes]} - ${data.slice(0, 4)}`);
}

function converteDataFormatoBR(data) {
    if (data != "") {
        return `${data.slice(8, 10)}/${data.slice(5, 7)}/${data.slice(0, 4)}`;
    }
}

function converteDataFormatoEN(data) {
    if (data != "") {
        return (`${data.slice(6)}-${data.slice(3, 5)}-${data.slice(0, 2)}`)
    }
}

function dividirDataParcelas(data) {
    if (data != "") {
        objData = DataJson(data)

        objData.mes = parseInt(objData.mes) + 1
        if (objData.mes > 12) {
            return tratarQuebraDeAno(`${objData.ano}-${objData.mes}-${objData.dia}`)
        }

        return (`${objData.ano}-${objData.mes}-${objData.dia}`)
    }
}

function teste() {
    alert("Botão sem ação.")
}

function tratarQuebraDeAno(data) {
    objData = DataJson(data)
    
    if (objData.mes == 13) {
        objData.mes = String("01")
        objData.ano = parseInt(objData.ano) + 1
    } else if (objData.mes == 0) {
        objData.mes = String("12")
        objData.ano = parseInt(objData.ano) - 1
    }
    
    if (String(objData.dia).length == 1) {
        String(objData.dia = "0" + objData.dia)
    }

    if (String(objData.mes).length == 1) {
        String(objData.mes = "0" + objData.mes)
    }
    return (`${objData.ano}-${objData.mes}-${objData.dia}`)
}

function mesProximo() {
    objData = DataJson(dataReferencia)
    objData.mes = parseInt(objData.mes) + 1

    if (objData.mes > 12) {
        dataReferencia = tratarQuebraDeAno(`${objData.ano}-${objData.mes}-${objData.dia}`)
    } else {
        dataReferencia = `${objData.ano}-${objData.mes}-${objData.dia}`
    }

    buscarMesReferencia(obterMes(dataReferencia))
}

function mesAnterior() {
    objData = DataJson(dataReferencia)
    objData.mes = parseInt(objData.mes) - 1

    if (objData.mes > 12) {
        dataReferencia = tratarQuebraDeAno(`${objData.ano}-${objData.mes}-${objData.dia}`)
    } else {
        dataReferencia = tratarQuebraDeAno(`${objData.ano}-${objData.mes}-${objData.dia}`)
        //dataReferencia = `${objData.ano}-${objData.mes}-${objData.dia}`
    }

    buscarMesReferencia(obterMes(dataReferencia))
}

function DataJson(data) {
    var dia = new Number()
    var mes = new Number()
    var ano = new Number()

    if (data != "") {
        dia = data.slice(8, 10)
        mes = parseInt(data.slice(5, 7), 10)
        ano = parseInt(data.slice(0, 4), 10)

        if (String(dia).length == 1) {
            String(dia = "0" + dia)
        }

        if (String(mes).length == 1) {
            String(mes = "0" + mes)
        }

        return {
            "dataComHifen": `${ano}-${mes}-${dia}`,
            "dataComBarra": `${ano}/${mes}/${dia}`,
            "formatadaComHifen": `${dia}-${mes}-${ano}`,
            "formatadaComBarra": `${dia}/${mes}/${ano}`,
            "dia": String(dia),
            "mes": String(mes),
            "ano": String(ano)
        }
    }
}