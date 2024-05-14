var x = 0;
let on = "off";

client = new Paho.MQTT.Client("mqtt.netpie.io",443,"xxx"); // The last one is Client ID
client.onMessageArrived = onMessageArrived;

var options = {
    useSSL: true,
    userName: "xxx", // This is token
    password: "xxx", // This is secret
    onSuccess: onConnect,
    onFailure: doFail,                                                  
}

client.connect(options);

function onConnect(){
    client.subscribe("@msg/test");
}

function doFail(e){
    console.log(e);
}

function myFunction()
{
    // เป็นปุ่มที่ใช้เปิดปิดน้ำ
    // x = document.getElementById("myText").value ;
    // document.getElementById.innerHTML = x ;
    if(on == "off"){
        on = "on";
    }else{
        on = "off";
    }
    mqttSend("@msg/on",on);
    console.log(on);
}

function onMessageArrived(message)
{
    // ใช้ array ขนาด 3 ช่อง test ก่อนก็ได้นะแบบเสมือนรับข้อมูลจาก Sensor มา ยังไม่ต้องส่งข้อมูลจริงๆ
    // เราน่าจะรับมาเป็น String รูปแบบเป็น temp,humi,dust ละเอามา split ทำเป็น array ขนาด 3 ช่อง
    document.getElementById("show").innerHTML = message.payloadString;
    var temp = message.payloadString.split(",");
    document.getElementById("temp").innerHTML = "temp = " + temp[0];
    document.getElementById("humi").innerHTML = "humi = " + temp[1];
    document.getElementById("dust").innerHTML = "dust = "+ temp[2];
}

var mqttSend = function (topic,msg){
    var message = new Paho.MQTT.Message(msg);
    message.destinationName = topic;
    client.send(message);
}











