const Discord = require("discord.js");
const bot = new Discord.Client(); //construtor da classe Client para o bot da Discord API
var canalMatchmaking = '272114679306911750';
const servidorPrincipal = '266619332186865675';
const util = require("./utilitarios.js");
const utilFun = new util();

var fs = require('fs');
var tempoLimite = util.minuto(10); //VARIAVEL GLOBAL PELOS HUES

bot.login("MjcyMDI0NjAyMTk5MTk1NjQ4.C2QUKw.5lDgDo61K6nIp0WyEUdnn2OCve8");
bot.once("ready", () => 
{ 
    console.log(`${bot.user.username} está online em ${bot.guilds.size} servidor(es)`); //emitido quando o evento ready for engatilhado pelo cliente
    let servidor = bot.guilds.get(servidorPrincipal);
    if (servidor==null)
        console.log("O servidor está indisponível.")
    else
    {
        console.log(servidor.name)
        let canal = servidor.channels.get(canalMatchmaking);
        if (canal==null)
            console.log("O canal está indisponível.")
        else
        {
            console.log(util.minuto(1)[0]);
            /*fs.unlink('./tmp/ultimaID.js', (err) => 
            {
                if(!err)
                    console.log('successfully deleted /tmp/ultimaID.js');
                else
                    console.log(err);
            })*/
            setInterval(temporizador => {utilFun.notificador(bot,servidor,servidor.channels.get(canalMatchmaking),tempoLimite);}, util.segundo(25)[0]);
            setInterval(temporizador =>
            {
                utilFun.limpeza(bot,servidor,servidor.channels.get(canalMatchmaking),tempoLimite);
            }, util.segundo(25)[0]);
            console.log(canal.name);
        }
    }
});


bot.on("message", msg =>
{
    if(msg.channel.id == canalMatchmaking)
    {
        console.log(`[${msg.id}][${msg.channel.id}]${msg.author.username}:${msg.content}`); //emitido quando o evento ready for engatilhado pelo cliente
        //if(msg.author.role == secretRole )
        if(msg.content.startsWith('!pin'))
        {
            msg.pin();
            utilFun.deletarPins(bot,msg, servidorPrincipal, canalMatchmaking);
        }
        
        if(msg.content.startsWith('!t'))
        {
            definirTempo(msg);
        }

        
    }
    if(msg.content.startsWith("!matchmaking"))
    {
        utilFun.deletarPins(bot,msg,servidorPrincipal,canalMatchmaking);   
        canalMatchmaking=msg.channel.id;
    }
})

function definirTempo(msg)
{
    let argumentos=msg.content.split(" ")
    {
        if(argumentos[1]!=null && argumentos[2]!=null)
        {
            argumentos[1]=Math.round(argumentos[1]);
            console.log(argumentos[2]);
            switch(argumentos[2])
            {
                case 'hora': 
                    if(argumentos[1]<=0) 
                        msg.reply("valor muito pequeno, tente novamente.");
                    else
                    {
                        tempoLimite=util.hora(argumentos[1]); 
                        msg.reply("atualizado.");
                    }
                    break;
                case 'min':
                    if(argumentos[1]<=0)
                        msg.reply("valor muito pequeno, tente novamente.");
                    else
                    {
                        tempoLimite=util.minuto(argumentos[1]);
                        msg.reply("atualizado.");
                    }
                    break;
                case 'seg':
                    if(argumentos[1]<=0)
                    msg.reply("não fode.");
                    else
                    {
                        tempoLimite=util.segundo(argumentos[1]);
                        msg.reply("atualizado.");
                    }
                    break;
                msg.reply("inválido, tente novamente. Exemplo:`!t 20 min`");
            }
            
        }
        else
        {
            msg.reply("inválido, tente novamente. Exemplo:`!t 20 min`");
        }
    }
}