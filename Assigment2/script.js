//ดึงเรทเงินโลกจากเว็บกลาง
async function getRealRate() {
    try {
        let response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        let data = await response.json();
        rate = data.rates.THB;
        document.getElementById("rate-text").innerHTML = "อัตราแลกเปลี่ยน: 1 usd = " + rate + " bath";
    } catch (error) {
        console.log(error);
    }
}
getRealRate();  
//ที่เก็บประวัติ
let historyArray = []; 
//ดอลไปบาท
function usdTobath() {
    let usd = document.getElementById("input-usd").value;
    let bath = usd * rate;
    document.getElementById("input-bath").value = bath;
}
//บาทไปดอล
function bathTousd() {
    let bath = document.getElementById("input-bath").value;
    let usd = bath / rate;
    document.getElementById("input-usd").value = usd;
}
//เคลียประวัติ
function clearData() {
    document.getElementById("input-usd").value = "";
    document.getElementById("input-bath").value = "";
}
//ตัวบันทึกประวัติ
function saveToHistory() {
    let usd = document.getElementById("input-usd").value;
    let bath = document.getElementById("input-bath").value;
//ถ้าช่องว่างไม่ต้องทำ
    if (usd == "" || bath == "") {
        return;
    }  
//ข้อความประวัติ
    let text = usd + " usd = " + bath + " bath";   
//เอาที่แปลงเงินล่าสุดไปอยู่บนสุด
    historyArray.unshift(text);   
//เกิน 10 จะลบอันแรกที่กรอก
    if (historyArray.length > 10) {
        historyArray.pop();
    }    
//โชว์ประวัติ
    showHistory();
}  
//แสดงประวัติหน้าเว็บ
function showHistory() {
    let list = document.getElementById("history-list");
// ล้างของเก่าบนหน้าจอก่อน
    list.innerHTML = "";     
//เอาประวัติมาแสดงทีละบรรทัด
    for (let i = 0; i < historyArray.length; i++) {
        list.innerHTML += "<li>" + historyArray[i] + "</li>";
    }
}    
//ฟังก์ชันล้างประวัติ
function clearHistory() {
    historyArray = [];
    showHistory();
}        
//เวลาปัจจุบัน
function showTime() {
    let now = new Date();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    let timeString = h + ":" + m + ":" + s;
//คือข้อความข้างหน้าของเวลา
    document.getElementById("time-text").innerHTML = "เวลาอัปเดต: " + timeString;
}       
//เวลาเปิดเว็บ
showTime();