const express = require('express');
const http = require('http');
const https = require('https');
const url = require('url');
const WebSocket = require('ws');


const app = express();
app.set('views', './views');
app.set('view engine', 'ejs');





var listConnect = [];
var connectionIDCounter = 0;

var port = process.env.PORT || 8080;


function sendObj(message) {
    var to = message.to;
    if (!to)
        return;
    message.to = '';
    var strmes = JSON.stringify(message);
    var from = message.from;

    var adr = to.split(';');

    adr.forEach(function (item, i, a) {
        sendMessage(item, strmes, from);
    });
}


function sendMessage(to, message, from) {
    for (var i = 0; i < listConnect.length; i++) {
        if (i < 0)
            break;
        if (to == 'all' || to == listConnect[i].info.UserID || to == listConnect[i].info.UserName || to == listConnect[i].info.UserGroup) {
            try {
                listConnect[i].send(message);
            }
            catch (err) {
                listConnect.splice(i, 1);
                i--;
            }

            if (to == listConnect[i].info.UserID || to == listConnect[i].info.UserName) {

                for (var j = 0; j < listConnect.length; j++) {
                    if (listConnect[j].info.UserID == from)
                        try {
                            listConnect[j].send(message);
                        }
                        catch (err) {

                        }

                }
            }


        }
    }

}
app.use(express.static('assets'));
app.get('/admin', function (req, res) {
    res.render('index', { listConnect: listConnect });
});

const server = http.createServer(app);
const wss = new WebSocket.Server({
    server: server,
    clientNoContextTakeover: true,
    serverNoContextTakeover: true
});




wss.on('connection', function connection(ws, req) {
    //const location = url.parse(req.url, true);
    // You might use location.query.access_token to authenticate or share sessions
    // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

    var SID = connectionIDCounter++;
    var Start = new Date();
    ws.info = { SID: SID, Start: Start };
    listConnect.push(ws);
    //console.log(listConnect.length.toString());

    ws.on('error', () => console.log('errored'));

    ws.on('message', function incoming(message) {
        //console.log('received: %s', message);
        try {
            objMes = JSON.parse(message);
            var mtype = objMes.type;
            if (mtype == 'echo') {
                ws.send(message);
                return;
            }

            if (mtype == 'auth') {
                if (objMes.UserID)
                    ws.info.UserID = objMes.UserID;
                if (objMes.UserName)
                    ws.info.UserName = objMes.UserName;
                if (objMes.UserGroup)
                    ws.info.UserGroup = objMes.UserGroup;
                return;
            }

            if (mtype == 'message') {
                var to = objMes.to;
                if (!to) {
                    var errorto =
                    {
                        type: "error",
                        fromName: "error",
                        message: "Empty field 'to'",
                        source: message
                    };
                    try {
                        ws.send(JSON.stringify(errorto));
                    }
                    catch (ex) { ; }
                    return;
                }
                //Отправляем эхо
                //ws.send(message);
                sendObj(objMes);
                return;
            }
            //Неизвестный тип сообщения    
            var ansve =
            {
                type: "error",
                fromName: "error",
                message: "Unknown type",
                source: message
            };
            try {
                ws.send(JSON.stringify(ansve));
            }
            catch (ex) { ; }
        }
        catch (e) {
            var ansve =
            {
                type: "error",
                fromName: "error",
                message: e.message,
                source: message
            };
            try {
                ws.send(JSON.stringify(ansve));
            }
            catch (ex) { ; }

        }

    });

    ws.on('close', function (code, reason) {
        var idx = listConnect.indexOf(ws);
        if (idx != -1) {
            listConnect.splice(idx, 1);
        }
        //console.log('Disconnect ' + ws.info.SID.toString());
        //console.log(listConnect.length.toString());
    });


});


setInterval(function timeout() {
    try {
        sendMessage('all', '', '');
    }
    catch (err) { ; }
}, 30000);


server.listen(port, function listening() {
    console.log('Start server:' + port.toString());
});