let transactions = []; 
let currentId = 1;
const form = document.getElementById('transaction-form'); // ตัวฟอร์มหลัก
const textInput = document.getElementById('text'); //ช่องกรอกชื่อรายการ
const categoryInput = document.getElementById('category'); //หมวดหมู่ เลือกหมวดหมู่
const typeInput = document.getElementById('type'); //หมวดหมู่ เลือกประเภท (รายรับ/รายจ่าย)
const amountInput = document.getElementById('amount'); // ช่องกรอกจำนวนเงิน
//ตารางประวัติและสรุปยอดเงิน
const list = document.getElementById('transaction-list'); //ข้อความในตาราง
const balanceEl = document.getElementById('net-balance'); //ตัวเลขยอดคงเหลือสุทธิ
const incomeEl = document.getElementById('total-income'); //ตัวเลขรายรับรวม
const expenseEl = document.getElementById('total-expense'); //ตัวเลขรายจ่ายรวม
const searchInput = document.getElementById('search'); //ช่องค้นหารายการ
const clearBtn = document.getElementById('btn-clear'); //ปุ่มล้างข้อมูลทั้งหมด

//เพิ่มรายการ
function addTransaction(e) {
//กันไม่ให้หน้าเว็บรีตอนกดปุ่ม Submit
    e.preventDefault(); 
//สร้างObjectใหม่เพื่อจัดเก็บข้อมูลรายการที่เพิ่งกรอกเข้ามา
    const transaction = {
        id: currentId++, //กำหนด ID แล้วบวกเพิ่มทีละ 1 รายการถัดไป
        text: textInput.value, //เก็บชื่อรายการที่กรอก
        category: categoryInput.value, //เก็บหมวดหมู่ที่เลือก
        type: typeInput.value, //เก็บประเภท (รายรับ รายจ่าย)
        amount: parseFloat(amountInput.value) //แปลงข้อความจำนวนเงินให้เป็นตัวเลขทศนิยม (Float) เพื่อนำไปคำนวณต่อ
    };
// นำ Object ข้อมูลใหม่ ไปต่อท้ายใน Array 'transactions'
    transactions.push(transaction); 
//ล้างค่าในช่องข้อมูลให้ว่างเปล่า เพื่อเตรียมรับข้อมูลรายการต่อไป
    textInput.value = '';
    categoryInput.value = '';
    amountInput.value = '';
//ใช้ฟังก์ชันอัปเดตหน้าจอเพื่อใแสดงข้อมูลล่าสุด
    updateUI(); 
}
// รับค่าพารามิเตอร์ dataToRender ซึ่งอาจจะเป็นข้อมูลทั้งหมด หรือข้อมูลที่ถูกค้นหา/กรองมาแล้ว
function renderList(dataToRender) {
//ล้างข้อมูลเดิมในตารางบนหน้าเว็บออกให้หมดก่อน เพื่อเตรียมวาดตารางใหม่
    list.innerHTML = ''; 
//วนลูปนำข้อมูลใน Array ออกมาสร้างเป็นแถวของตาราง (<tr>) ทีละรายการ
    dataToRender.forEach((tr, index) => {
//สร้างแท็ก <tr>  ใหม่
        const row = document.createElement('tr');
//ตรวจสอบเงื่อนไข: ถ้ารายรับให้ใส่คลาสสีเขียว (type-income) ถ้ารายจ่ายสีแดง (type-expense)
        const typeClass = tr.type === 'รายรับ' ? 'type-income' : 'type-expense';
//ตรวจสอบเงื่อนไข: ถ้ารายรับใส่เครื่องหมาย + ถ้ารายจ่ายใส่เครื่องหมาย -
        const sign = tr.type === 'รายรับ' ? '+' : '-';
//เขียนโค้ด HTML ยัดข้อมูลลงในแท็ก <td> (คอลัมน์) แต่ละช่อง
        row.innerHTML = `
            <td>${index + 1}</td> <!-- ลำดับที่ (อิงตาม Index ของข้อมูลที่แสดงผลบนหน้าจอ) -->
            <td class="${typeClass}">${tr.type}</td> <!-- ประเภท -->
            <td>${tr.text}</td> <!-- ชื่อรายการ -->
            <td>${tr.category}</td> <!-- หมวดหมู่ (โจทย์ข้อ 1) -->
            <td class="${typeClass}">${sign}฿${tr.amount.toFixed(2)}</td> <!-- จำนวนเงินพร้อมทศนิยม 2 ตำแหน่ง -->
        `;
//นำแถว <tr> ที่สร้างเสร็จแล้วไปต่อท้ายในเนื้อหาตาราง (<tbody>) บนหน้าเว็บ
        list.appendChild(row);
    });
}
// ฟังก์ชันสำหรับ "คำนวณและสรุปรายงานการเงิน" (โจทย์ข้อ 4)
function updateSummary(data) {
// 1. คำนวณรายรับรวม: กรอง (filter) เอาเฉพาะ รายรับ แล้วนำจำนวนเงินมาบวกกันทั้งหมด 
    const income = data
        .filter(item => item.type === 'รายรับ')
        .reduce((sum, item) => sum + item.amount, 0);
// 2. คำนวณรายจ่ายรวม: กรอง (filter) เอาเฉพาะ รายจ่าย แล้วนำจำนวนเงินมาบวกกันทั้งหมด 
    const expense = data
        .filter(item => item.type === 'รายจ่าย')
        .reduce((sum, item) => sum + item.amount, 0);
// 3. คำนวณเงินคงเหลือสุทธิ (รายรับลบด้วยรายจ่าย)
    const balance = income - expense;
//นำตัวเลขที่คำนวณได้ ไปแสดงผลแทนที่ข้อความเดิมบนหน้าเว็บ
    incomeEl.innerText = `฿${income.toFixed(2)}`;
    expenseEl.innerText = `฿${expense.toFixed(2)}`;
    balanceEl.innerText = `฿${balance.toFixed(2)}`;
}
//ฟังก์ชัน "ศูนย์กลางจัดการการแสดงผล"
//ทำหน้าที่ประมวลผลเงื่อนไขต่างๆ ก่อนที่จะสั่งให้ตารางและสรุปยอดเงินอัปเดต
function updateUI() {
//ดึงข้อความจากช่องค้นหามาแปลงเป็นตัวพิมพ์เล็กทั้งหมด เพื่อให้ค้นหาตัวพิมพ์เล็ก-ใหญ่ได้ตรงกัน
    const searchTerm = searchInput.value.toLowerCase();
//ข้อมูลทั้งหมดมากรอง เอาเฉพาะรายการที่มีคำค้นหาผสมอยู่ใน ชื่อรายการ
    const filteredTransactions = transactions.filter(tr => 
        tr.text.toLowerCase().includes(searchTerm)
    );
//สั่งวาดตารางใหม่ โดยส่งข้อมูลที่ถูกกรองแล้วไปแสดง (ถ้าไม่ได้พิมพ์ค้นหา ข้อมูลก็จะมาครบ)
    renderList(filteredTransactions);
//สั่งคำนวณยอดเงินใหม่ (ตรงนี้ส่ง Array เต็มไปคำนวณเสมอ เพื่อไม่ให้ยอดรวมเพี้ยนเวลาค้นหา)
    updateSummary(transactions); 
}
//ฟังก์ชันล้างข้อมูลทั้งหมด
function clearAllData() {
//แสดงกล่องแจ้งเตือนให้ผู้ใช้กดยืนยัน
//ถ้ากดตกลงค่าจะเป็น true, ถ้ายกเลิก ค่าจะเป็น false
    const isConfirm = confirm("คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลทั้งหมด?");
    if (isConfirm) {
//หากผู้ใช้กดตกลง
        transactions = []; //รีเซ็ต Array ให้ว่างเปล่า (ลบข้อมูลทิ้งทั้งหมด)
        currentId = 1;     //รีเซ็ตเลขลำดับกลับไปเริ่มที่ 1 ใหม่
        searchInput.value = ''; //เคลียร์ช่องค้นหาให้ว่าง
//สั่งอัปเดตหน้าจอใหม่ ตารางจะถูกวาดเป็นค่าว่าง และยอดเงินจะกลับเป็น ฿0.00
        updateUI(); 
    }
}
//เมื่อผู้ใช้กดปุ่ม Submit ในฟอร์ม กดเพิ่มรายการ ให้ไปเรียกใช้งานฟังก์ชัน addTransaction
form.addEventListener('submit', addTransaction);
//ฟังก์ชันถ้าพิมพ์ในช่องค้นหาจะเด้งข้อความทันที
// ให้ไปเรียกฟังก์ชัน updateUI เพื่อกรองข้อมูลทันที
searchInput.addEventListener('input', updateUI); 
//ถ้ากดล้างข้อมูลจะใช้ฟังก์ชัน clearAllData
clearBtn.addEventListener('click', clearAllData);
//สั่งทำงานฟังก์ชัน updateUI 1 ครั้งตอนเปิดเว็บครั้งแรก
//เพื่อเคลียร์หน้าจอและตั้งค่าเริ่มต้นต่างๆ
updateUI();