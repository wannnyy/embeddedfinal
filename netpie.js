var x = 0;
let sensors= {
    temp:"",
    humi:"",
    dust:"",
}
let on = "off";

client = new Paho.MQTT.Client("mqtt.netpie.io",443,"87050973-a747-4a1a-a0d2-5822f372db"); // The last one is Client ID
client.onMessageArrived = onMessageArrived;

var options = {
    useSSL: true,
    userName: "MFkDHUkm86b5PBQ6x8Ejazq4cVNWnQ", // This is token
    password: "WM8Zs6ozJGzsJYxFc1WUkPRquvQRMc", // This is secret
    onSuccess: onConnect,
    onFailure: doFail,                                                  
}

client.connect(options);

//have to both send msg and update the shadow

function onConnect(){
    client.subscribe("@msg/test");
}

async function getShadowData() {
  let fdata;
  const url = "https://api.netpie.io/v2/device/shadow/data"; 
  const clientID = "96df986a-def6-4028-9794-637a355c7a90"; // clientId of sensors
  const token = "squtuLxvW749hzwJhXNzL9PULrasxuqE"; // token of sensors

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `Basic ${btoa(`${clientID}:${token}`)}`
    }
  });

  if (response.ok) {
    const data = await response.json();
    console.log("Shadow Data:", data);
    // return data;
    fdata = data;
  } else {
    console.error("Failed to retrieve shadow data", response.statusText);
  }
  sensors = fdata;
}

// getShadowData();
// refresh(); 

function refresh(){
    getShadowData();
    console.log(sensors);
    document.getElementById("temp").innerHTML = "temp = " + sensors.data.temp;
    document.getElementById("humi").innerHTML = "humi = " + sensors.data.humi;
    document.getElementById("dust").innerHTML = "dust = " + sensors.data.dust;
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



/* */







