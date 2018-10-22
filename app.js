'use strict';

const express = require('express');
const bodyParser = require('body-parser')
const request = require('request');
const access_token = "EAAcitmt0owYBAOF8Di8WSqKGmI9XkrF2XkaPgRz5QoTCyuSzZAo3Bo0QQZCcs0HvAO808RGzluENIzI3ATLSm4XKow6K6HWUAg80XpZCfyNAO24dNYyM312z6fHkp0XiTpVvzw4WAp4ZCZAsR3d8xVvYykUVUZBmaGtC3KiWal6QZDZD";

const app = express();

app.set('port', 5000);
app.use(bodyParser.json());

app.get('/', function (req, response) {
    response.send('Hola mundo');
});

app.get('/webhook', function (req, response) {
    if (req.query['hub.verify_token'] === 'zikerbot_token') {
        response.send(req.query['hub.challenge']);
    } else {
        response.send("ZikerBot, you don't have any permissions");
    }
});

app.post('/webhook/', (req, res) => {
    const webhook_event = req.body.entry[0];
    if (webhook_event.messaging) {
        webhook_event.messaging.forEach(event => {
            //handleMessage(event);
            handleEvent(event.sender.id, event)
        });
    }
    res.sendStatus(200);
});

// function handleMessage (event) {
//     const senderId = event.sender.id;
//     const messageText = event.message.text;
//     const messageData = {
//         recipient: {
//             id: senderId
//         },
//         message: {
//             text: messageText
//         }
//     }
//     callSendApi(messageData)
// }

function defaultMessage(senderId) {
    const messageData = {
        recipient: {
            id: senderId
        },
        message: {
            text: "Holi Unicornio soy tu Zikerbot para que no me extrañes 😘",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "¿Me extrañas 😟?",
                    "payload": "MISSING_PAYLOAD"
                },
                {
                    "content_type": "text",
                    "title": "Que diría en este momento",
                    "payload": "ARYS_MESSAGES"
                }
            ]
        }
    }
    senderAction(senderId);
    callSendApi(messageData);
}

function senderAction(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "sender_action": "typing_on"
        // "sender_action": "mark_seen"
        // "sender_action": "typing_off"

    }
    callSendApi(messageData);
}

function handleAttachments(senderId, event) {
    let attachment_type = event.attachments[0].type;

    switch (attachment_type.toLowerCase()) {
        case "image":
            console.log(attachment_type)
            break;
        case "video":
            console.log(attachment_type)
            break;
        case "audio":
            console.log(attachment_type);
            break;

        case "file":
            console.log(attachment_type);
            break;
        case "location":
            console.log(JSON.stringify(event)); //OBTINE LAT Y LON
            break;
    }
}

function handleMessage(senderId, event) {
    if (event.text) {
        defaultMessage(senderId)
       // contactSupport(senderId)
       // showLocation(senderId) 
       // receipt(senderId);
       //getLocation(senderId);
    } else if (event.attachments) {
        handleAttachments(senderId, event)
    }
}

function handlePostback(senderId, payload) {
    console.log(payload)
    switch (payload) {
        case "GET_STARTED_ZIKERBOT":
            openMessage(senderId);
            messageImage(senderId);
            break;
        case "ARYS_JOKES":
            console.log("había una-vez-truz 🤣");
            break;
        case "ARYS_MESSAGES":
            console.log("Amo tanto tus chinillos ➕ que los 🌮 al pastor 😍");
            break;
        case "CARDS_PAYLOAD":
            showCards(senderId);
            break;
        case "UNICORN_IMAGE_PAYLOAD":
            size(senderId);
            break;
        case "MISSING _PAYLOAD":
            contactSupport(senderId);
            break;
    }
}

function handleEvent(senderId, event) {
    if (event.message) {
        handleMessage(senderId, event.message)
    } else if (event.postback) {
        handlePostback(senderId, event.postback.payload)
    }
}

function callSendApi(response) {
    request({
        "uri": "https://graph.facebook.com/me/messages/",
        "qs": {
            access_token
        },
        "method": "POST",
        "json": response
    },
        function (err) {
            if (err) {
                console.log("Somenthig went wrong");
            } else {
                console.log("Message send success");
            }
        })
}

function showCards(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            attachment: {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": "Unicornios",
                            "image_url": "https://image.freepik.com/vector-gratis/lindo-animal-haciendo-dabbing_23-2147847948.jpg",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Unicornio",
                                    "payload": "UNICORN_IMAGE_PAYLOAD"
                                }
                            ]
                        },
                        {
                            "title": "Pandas",
                            "image_url": "https://image.freepik.com/vector-gratis/plantilla-de-pegatina-pandacorn-lindo-y-divertido_7505-422.jpg",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Pandacornio",
                                    "payload": "PANDA_IMAGE_PAYLOAD"
                                }
                            ]
                        },
                        {
                            "title": "Dinosaurios",
                            "image_url": "https://i.pinimg.com/736x/e4/5d/77/e45d77808c966908b47c0c123cd1ac32--jurassic-park-world-raptors.jpg",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Dinosaurios",
                                    "payload": "DINO_IMAGE_PAYLOAD"
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }
    callSendApi(messageData);
}

function messageImage(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            attachment: {
                "type": "image",
                "payload": {
                    "url": "https://media.giphy.com/media/QLNECjmItSvwA/giphy.gif"
                }
            }
        }
    }
    callSendApi(messageData);
}

function openMessage(senderId) {
    const messageData = {
        recipient: {
            id: senderId
        },
        message: {
            text: "Holi Unicornio soy tu Zikerbot para que no me extrañes 😘"
        }
    }
    callSendApi(messageData);
}


function showLocation(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            attachment: {
                "type": "template",
                "payload": {
                    "template_type": "list",
                    "top_element_style": "large",
                    "elements": [
                        {
                            "title": "Trabajo Zikeron",
                            "image_url": "http://www.centroscomercialescarso.com/images/gallery/plaza_carso/plaza_carso_03.jpg",
                            "subtitle": "plaza carso",
                            "buttons":[
                                {
                                    "title": "ver en map",
                                    "type": "web_url",
                                    "url": "https://goo.gl/maps/HQKTk1cQZyH2",
                                    "webview_height_ratio": "full"
                                }
                            ]
                        },
                        {
                            "title": "Casa Zikeron",
                            "image_url": "https://mapa.telescopio.com.mx/coord/16/14733/29171.png",
                            "subtitle": "plaza carso",
                            "buttons":[
                                {
                                    "title": "ver en map",
                                    "type": "web_url",
                                    "url": "https://goo.gl/maps/jzS5W2kJhcp",
                                    "webview_height_ratio": "tall"
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }
    callSendApi(messageData);
}


function contactSupport(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            attachment: {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": "Hola chinillos 😍, ¿quieres enlazar una llamada conmigo?  🙊",
                    "buttons": [
                        {
                            "type": "phone_number",
                            "title": "Llamar a Zikeron",
                            "payload": "+525514523366"
                        }
                    ]
                }
            }
        }
    }
    callSendApi(messageData);
}

function receipt(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "receipt",
                    "recipient_name": "Ary Rosas",
                    "order_number": "123123",
                    "currency": "MXN",
                    "payment_method": "Efectivo",
                    "order_url": "",
                    "timestamp": "123123123",
                    "address": {
                        "street_1": "triton 24 col sideral",
                        "street_2": "---",
                        "city": "Mexico",
                        "postal_code": "09320",
                        "state": "Mexico",
                        "country": "Mexico"
                    },
                    "summary": {
                        "subtotal": 12.00,
                        "shipping_cost": 2.00,
                        "total_tax": 1.00,
                        "total_cost": 15.00
                    },
                    "adjustments": [
                        {
                            "name": "Descuento frecuent",
                            "amount": 1.00
                        }
                    ],
                    "elements": [
                        {
                            "title": "Unicorn",
                            "subtitle": "",
                            "quantity": 1,
                            "price": 10,
                            "currency": "MXN",
                            "image_url": "https://image.freepik.com/vector-gratis/lindo-animal-haciendo-dabbing_23-2147847948.jpg"
                        }
                    ]
                }
            }
        }
    }
    callSendApi(messageData);
}

function getLocation (senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "text": "deseas proporcionarnos tu ubi",
            "quick_replies": [
                {
                    "content_type": "location"
                }
            ]
        }
    }
    callSendApi(messageData)
}

function size(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            attachment: {
                "type": "template",
                "payload": {
                    "template_type": "list",
                    "top_element_style": "large",
                    "elements": [
                        {
                            "title": "Pequeño unicornio",
                            "image_url": "https://image.freepik.com/vector-gratis/lindo-animal-haciendo-dabbing_23-2147847948.jpg",
                            "subtitle": "Pequeño Elegido",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Elegir pequeño",
                                    "payload": "LIL_UNICORN_PAYLOAD"
                                }
                            ]
                        },
                        {
                            "title": "Mediano unicornio",
                            "image_url": "https://image.freepik.com/vector-gratis/lindo-animal-haciendo-dabbing_23-2147847948.jpg",
                            "subtitle": "Mediano Elegido",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Elegir mediano",
                                    "payload": "MID_UNICORN_PAYLOAD"
                                }
                            ]
                        }

                    ]
                }
            }
        }
    }
    callSendApi(messageData);
}
app.listen(app.get('port'), function () {
    console.log("Nuestro servidor esta funcionando en el puerto ", app.get('port'));
});
