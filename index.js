 var nextMessageId = 0;
 var url = "http://students.a-level.com.ua:10012";

 async function sendData(data){
    let answer = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data)
    });
    let json = await answer.json();
    return json;
}       

async function sendMessage(nick, message){
    var data    = {func: "addMessage", nick: nick, message: message, author: 'chat'};
    await sendData(data);
    await getMessages();
}

function cleanUp(text){
    if (typeof text !== 'string')
        return text;
    if (text.match(/<script/i)){
        let el = document.createElement('div');
        el.innerText = text;
        return `<h1>SUPER HACKER CODE:</h1><pre>${el.innerHTML}</pre>`
    }
    return text;
}
async function getMessages(){
    var data    = {func: "getMessages", messageId: nextMessageId, author: 'chat'};
    let result = await sendData(data)
    for (var msgIndex in result.data){
        let msg = result.data[msgIndex];
        let div = document.createElement("div");
        let dateIn = new Date();
        dateIn.setTime(msg.timestamp);
        div.innerHTML = "<b>" + cleanUp(msg.nick) + "</b> :" + cleanUp(msg.message) + "<i>" +" in: " + dateIn.getHours() + ":" + dateIn.getMinutes() + "<i>";
        chat.insertBefore(div, chat.childNodes[0]);
    }
    nextMessageId = result.nextMessageId;    
}

getMessages();

document.getElementById("send").onclick = function(){
    var nick  = document.getElementById("nick").value;
    var message  = document.getElementById("msg").value;
    sendMessage(nick, message);
};

async function delay() {
    while(true){
        await getMessages();
    }
}

delay();
