var x = 0;
let sensors= {
    temp:"",
    humi:"",
    dust:"",
}
let on = "off";

let temperature,dustLevel
var humidity = 50 

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

function myFunction()
{
    // เป็นปุ่มที่ใช้เปิดปิดน้ำ
    // x = document.getElementById("myText").value ;
    // document.getElementById.innerHTML = x ;
    // if(on == "off"){
    //     on = "on";
    //     document.getElementById("my-button").innerHTML = "On"
    // }else{
    //     on = "off";
    //     document.getElementById("my-button").innerHTML = "Off"
    // }
    // mqttSend("@msg/on",on);
    // console.log(on);
    var button = document.getElementById("my-button");
    var block = document.getElementById("button-data-block");
            if (button.innerHTML === "off") {
                button.innerHTML = "on";
                button.classList.add("on"); // เพิ่มคลาส 'on' เพื่อเปลี่ยนสีเป็นสีเขียว
                mqttSend("@msg/on", "on");
            } else {
                button.innerHTML = "off";
                button.classList.remove("on"); // ลบคลาส 'on' เพื่อกลับไปสีแดง
                mqttSend("@msg/on", "off");
            }
            console.log(button.innerHTML);
    onMessageArrived("")
}  

function onMessageArrived(message)
{
    // ใช้ array ขนาด 3 ช่อง test ก่อนก็ได้นะแบบเสมือนรับข้อมูลจาก Sensor มา ยังไม่ต้องส่งข้อมูลจริงๆ
    // เราน่าจะรับมาเป็น String รูปแบบเป็น temp,humi,dust ละเอามา split ทำเป็น array ขนาด 3 ช่อง

    // ถ้าจะเทสการรับ message ให้เปิดตรงนี้
    document.getElementById("show").innerHTML = message.payloadString;
    var data = message.payloadString.split(",");
    // var data = [];
    // for (var i = 0; i < 3; i++) {
    //     // Generate random number between 0 and 100
    //     var randomNumber = Math.floor(Math.random() * 101);
    //     data.push(randomNumber);
    // }

    document.getElementById("temp").innerHTML = data[0] + " &deg;C";
    document.getElementById("humi").innerHTML = data[1] + " %";
    document.getElementById("dust").innerHTML = data[2] + " %";
}

var mqttSend = function (topic,msg){
    var message = new Paho.MQTT.Message(msg);
    message.destinationName = topic;
    client.send(message);
}










