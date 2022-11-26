function obterMes(data) {
    const mesNome = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    var mes = data.slice(5, 7) - 1
    return mesNome[mes];
}

function converteDataFormato(data) {
    if (data != "") {
        return `${data.slice(8, 10)}/${data.slice(5, 7)}/${data.slice(0, 4)}`;
    }
}