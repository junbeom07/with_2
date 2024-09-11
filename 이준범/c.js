const calendarBody = document.getElementById('calendar-body');
const monthYearDisplay = document.getElementById('month-year');
let currentDate = new Date();

function loadCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    calendarBody.innerHTML = '';
    monthYearDisplay.textContent = `${year}년 ${month + 1}월`;

    let row = document.createElement('tr');
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyCell = document.createElement('td');
        row.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        if (row.children.length === 7) {
            calendarBody.appendChild(row);
            row = document.createElement('tr');
        }

        const cell = document.createElement('td');
        cell.textContent = day;
        cell.setAttribute('data-date', `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);

        row.appendChild(cell);
    }

    calendarBody.appendChild(row);
}

document.getElementById('prev-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    loadCalendar(currentDate);
});

document.getElementById('next-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    loadCalendar(currentDate);
});

loadCalendar(currentDate);




const container = document.getElementById('laptop-number');
const totalLaptops = 32;

for (let i = 1; i <= totalLaptops; i++) {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    
    checkbox.type = 'checkbox';
    checkbox.name = 'laptop-number';
    checkbox.value = `pc${i.toString().padStart(2, '0')}`; // 두 자리 숫자로 변환
    
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(` PC${i.toString().padStart(2, '0')}`)); // 두 자리 숫자로 변환
    
    container.appendChild(label);
}