function StartConnect() {
    // alert('StartConnect');

    clientID = "clientID - " + parseInt(Math.random() * 100);
    host = '4e67ef57e7b74853ab48df4f2239cf2c.s1.eu.hivemq.cloud';
    port = 8884;
    const brokerUrl = `wss://${host}:${port}/mqtt`;
    userId = 'danika2';
    passwordId = "12345678Aa";
    // onSuccess: {
    //     console.log("mqtt connected");
    // };
    // onFailure: {
    //     onfail();
    // };
    // console.
    client = new Paho.MQTT.Client(brokerUrl, clientID);

    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    client.tls = tlsOptions;
    client.connect({
        onSuccess: onConnect,
        userName: userId,
        password: passwordId
    });
    // alert('Ideaig');

}
const tlsOptions ={
    useSSL:true,
};
function onConnect() {
    // alert('Connected to MQTT broker');
}

function onfail () {
    alert("Connection failed!!!");
    console.log("connection failed");
};

function onConnectionLost(responseObject) {
    alert('Connection lost' + responseObject.errorMessage);
}

function onMessageArrived(message) {
    console.log("OnMessageArrived: " + message.payloadString);
    // alert("OnMessageArrived: " + message.payloadString);
}

function StartDisconnect() {
    client.disconnect();
}

// function publishSwitch(Switch)
// {
//     topic="Switchtopic"
//     Message = new Paho.MQTT.Message(Switch);
//     Message.destinationName= topic;
//     client.send(Message);
// }

function publishMessage(message) {

    msg = message;
    topic = 'anyad2';

    Message = new Paho.MQTT.Message(msg);
    Message.destinationName = topic;
    client.send(Message);
}