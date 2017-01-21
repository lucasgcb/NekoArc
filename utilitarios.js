const segundo = 1000;
const minuto = (60 * segundo); //milisegundos
const hora = (60 * minuto); //milisegundos

function utilitarios()
{   
    this.limpeza = function limpeza(bot,servidor,canal,tempoLimite,ultimaID)
    {
        parametrosPesquisa={limit: 100};
        canal.fetchMessages(parametrosPesquisa) //A API da Discord tem um limite de 100 requests, mas a demora faz com que promises repetidas surjam para mensagens no limite.
        .then(mensagens => 
        {
            let registroMensagens=mensagens.array();
            for (var i=0; i<registroMensagens.length; i++)
            {
                if(registroMensagens[i]!=null)
                {
                    if(!registroMensagens[i].pinned) // se a mensagem estiver pinada
                    {
                        let dataAtual=new Date();
                        let dataMensagem=registroMensagens[i].createdAt;
                        if((dataAtual.getTime() - dataMensagem.getTime()) > tempoLimite[0]) // (diferença de data em milisegundos) > 1 hora -> delete
                        {
                            registroMensagens[i].delete()
                            .then(nota => {console.log(`Mensagem deletada: [${nota.id}]${nota.author.username}:${nota.content}`)})
                            .catch( err => {console.log(`Erro ao deletar mensagem. Provavelmente já foi deletada.`)});
                        }
                    }
                    else
                    {} //sem operação
                }
                else
                    return;
            }
        });
    }

    this.notificador = function notificador(bot, servidor, canal, tempoLimite)
    {
        
        parametrosPesquisa={limit: 100};
        canal.fetchPinnedMessages(parametrosPesquisa)
        .then(mensagens => 
        {
            let pinExiste=false;
            let registroMensagens=mensagens.array();
            if(registroMensagens!=null)
            {
                for (var i=0; i<registroMensagens.length; i++)
                {
                    let dataAtual = new Date();
                    if(registroMensagens[i].author.id==bot.user.id)
                        if(!registroMensagens[i].pinned) 
                        {
                            pinExiste=false;
                        }
                        else
                        {
                            pinExiste=true
                            let stringEnorme= `${dataAtual.getDate()}/${dataAtual.getMonth() + 1}/${dataAtual.getFullYear()} às ${ajusteMilitar(dataAtual.getHours())}:${ajusteMilitar(dataAtual.getMinutes())}]`;
                            let stringEnorme2= `${calculo(tempoLimite)} ${tempoLimite[1]}].\nUltimo check foi em: `
                            let argumentos = registroMensagens[i].content.split("[");
                            let atualizado = registroMensagens[i].content.replace(argumentos[1], stringEnorme2);
                            atualizado = atualizado.replace(argumentos[2], stringEnorme);
                            registroMensagens[0].edit(atualizado).catch( err => {console.log(`Erro em atualizar`)});;
                            console.log(`Check em [${stringEnorme}`)
                        }
                    else
                        if (i==(registroMensagens.length-1)) 
                        {
                            if(!pinExiste)
                            {
                                console.log("Mensagem pinada sumiu. Arrumando...");
                                let stringEnorme= `Ultimo check foi em: [${dataAtual.getDate()}/${dataAtual.getMonth() + 1}/${dataAtual.getFullYear()} às ${ajusteMilitar(dataAtual.getHours())}:${ajusteMilitar(dataAtual.getMinutes())}]`
                                canal.sendMessage
                                (
                                    `Bem vindo ao canal de ${canal}. Mensagens são consideradas velhas após [${calculo(tempoLimite)} ${tempoLimite[1]}].\n${stringEnorme}`
                                )
                                .then(novaMensagem=>{novaMensagem.pin()});
                            }
                        }
                }
            }
        });
    }

    this.deletarPins = function deletarPins(bot, mensagem, servidorPrincipal, canalMatchmaking)
    {
        let servidor = bot.guilds.get(servidorPrincipal);
        if (servidor==null)
            console.log("O servidor está indisponível.")
        else
        {
            let canal = servidor.channels.get(canalMatchmaking);
            if (canal==null)
                console.log("O canal está indisponível.")
            else
            {
                canal.fetchPinnedMessages({limit: 100})
                .then(mensagens => 
                {
                    let pinExiste=false;
                    let registroMensagens=mensagens.array();
                    if(registroMensagens!=null)
                    {
                        for (var i=0; i<registroMensagens.length; i++)
                        {
                            let dataAtual = new Date();
                            if(registroMensagens[i].author.id==bot.user.id)
                            {
                                registroMensagens[i].delete().catch( err => {console.log(`Erro ao deletar mensagem. Provavelmente já foi deletada.`)});;
                            }
                        }
                    }
                }).catch(err => console.log("Mensagem já foi deletada."));
            }
        }
    }
}

/*function lerArquivo(arquivo)
{
    fs.readFile(arquivo, (err, data) => 
    {
        if (err) return 0;
        else return data;
    });
}*/

/*function escreverArquivo(data)
{
    fs.writeFile('./tmp/ultimaID.js', data, (err) => {
        if (err)
            console.log('deu merda');
        else
            console.log('It\'s saved!');
    });
}*/

function ajusteMilitar(tempo) //Ajusta o tempo para sempre haverem 2 dígitos.
{
    switch(tempo)
    {
        case 0: return '00';
        case 1: return '01';
        case 2: return '02';
        case 3: return '03';
        case 4: return '04';
        case 5: return '05';
        case 6: return '06';
        case 7: return '07';
        case 8: return '08';
        case 9: return '09';
        default: return tempo;
    }
}

function calculo(tempoLimite) // Retorna o valor pela divisão em milisegundos
{
    switch(tempoLimite[1])
    {
        case 'segundo': return (tempoLimite[0] / segundo);
        case 'segundos': return (tempoLimite[0] / segundo);
        case 'minuto': return (tempoLimite[0] / minuto);
        case 'minutos': return (tempoLimite[0] / minuto);
        case 'hora': return (tempoLimite[0] / hora);
        case 'horas': return (tempoLimite[0] / hora);
        default: return 0;
    }
}
module.exports=utilitarios;

//Estas funções retornam um array cuja primeira posição é o tempo pedido em milisegundos, e segunda posição equivalente a string de unidade.
module.exports.hora= (multiplicador) => 
{ 
    let unidade;
    if (multiplicador * hora > (1 * hora) )
        unidade = 'horas';
    else
        unidade = 'hora';
    return [multiplicador * hora, unidade]
};

module.exports.minuto= (multiplicador) =>
{ 
    let unidade;
    if (multiplicador * minuto > (1 * minuto))
        unidade = 'minutos';
    else
        unidade = 'minuto';
    return [multiplicador * minuto, unidade]
};

module.exports.segundo= (multiplicador) =>
{ 
    let unidade;
    if (multiplicador * segundo > (1 * segundo))
        unidade = 'segundos';
    else
        unidade = 'segundo';
    return [multiplicador * segundo, unidade]
};
