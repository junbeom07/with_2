const laptopStatus = {};
const rentedLaptops = {}; // 대여 정보를 저장할 객체

// 초기 상태 설정
for (let i = 1; i <= 32; i++) {
    laptopStatus[`pc${i}`] = 'available';
}

// 교시 범위를 만들어주는 함수
const getPeriodRange = (periods) => {
    if (periods.length === 0) return '';
    
    let result = '';
    let tempRange = [periods[0]];

    // 교시 변환 함수
    const convertPeriod = (period) => {
        switch (period) {
            case 'm': return '아침시간';
            case 'l': return '점심시간';
            case 'd': return '석식시간';
            case 's': return '야자시간';
            default: return `${period}교시`;
        }
    };

    // 연속된 교시 그룹을 처리하는 함수
    for (let i = 1; i < periods.length; i++) {
        const current = periods[i];
        const previous = periods[i - 1];
        
        if (parseInt(current) === parseInt(previous) + 1) {
            tempRange.push(current);
        } else {
            if (tempRange.length > 1) {
                result += `${convertPeriod(tempRange[0])}~${convertPeriod(tempRange[tempRange.length - 1])}, `;
            } else {
                result += `${convertPeriod(tempRange[0])}, `;
            }
            tempRange = [current];
        }
    }
    
    if (tempRange.length > 1) {
        result += `${convertPeriod(tempRange[0])}~${convertPeriod(tempRange[tempRange.length - 1])}`;
    } else {
        result += `${convertPeriod(tempRange[0])}`;
    }
    
    return result.trim().replace(/,$/, ''); // 마지막 쉼표 제거
};

// 대여 폼 제출 시 처리
document.getElementById('rental-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const laptopNumbers = Array.from(document.querySelectorAll('#laptop-number input:checked')).map(checkbox => checkbox.value);
    const subject = document.getElementById('subject').value;
    const teacher = document.getElementById('teacher').value;
    const rentalTime = new Date();
    const rentalPeriods = Array.from(document.querySelectorAll('#rental-duration input:checked')).map(checkbox => checkbox.value);
    const periodRange = getPeriodRange(rentalPeriods);

    // 대여 정보를 로컬 스토리지에 저장
    const rentalData = {
        rentalTime,
        subject,
        teacher,
        periods: rentalPeriods
    };
    
    // 날짜를 기반으로 저장
    const dateKey = rentalTime.toLocaleDateString();
    let storedData = JSON.parse(localStorage.getItem('rentedLaptops')) || {};
    
    laptopNumbers.forEach(laptopNumber => {
        if (!storedData[dateKey]) {
            storedData[dateKey] = {};
        }
        if (!storedData[dateKey][laptopNumber]) {
            storedData[dateKey][laptopNumber] = [];
        }
        storedData[dateKey][laptopNumber].push(rentalData);
    });

    localStorage.setItem('rentedLaptops', JSON.stringify(storedData));

    // 랜탈 카드 UI 업데이트
    laptopNumbers.forEach(laptopNumber => {
        const rentalCard = `
            <div class="rental-card" data-id="${laptopNumber}" data-rental-time="${rentalTime}" data-periods="${rentalPeriods.join(',')}">
                <strong>${laptopNumber.toUpperCase()}</strong>
                <div>담당 교사: ${teacher}</div>
                <div>과목: ${subject}</div>
                <div>대여시간:<br> ${rentalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</div>
                <div>${periodRange}</div>
                <button class="return-btn" data-id="${laptopNumber}">반납하기</button>
            </div>
        `;
        document.getElementById('rented-laptops').insertAdjacentHTML('afterbegin', rentalCard);

        const laptopCell = document.getElementById(laptopNumber);
        laptopCell.textContent = teacher; // '담당 교사'로 변경
        laptopCell.classList.remove('available');
        laptopCell.classList.add('unavailable');

        laptopStatus[laptopNumber] = 'unavailable';

        // 대여 정보 저장
        if (!rentedLaptops[laptopNumber]) {
            rentedLaptops[laptopNumber] = [];
        }
        rentedLaptops[laptopNumber].push({
            rentalDateTime: rentalTime,  // 선택한 대여 시간을 저장
            subject,
            teacher,
            returned: false,
            periods: rentalPeriods
        });

    });

    document.getElementById('form-container').classList.add('hidden');
    document.getElementById('modal-overlay').style.display = 'none';
    document.getElementById('rental-form').reset();
    updateCheckboxState();
});

// 랜탈 카드의 반납 버튼 클릭 시 처리
document.getElementById('rented-laptops').addEventListener('click', function(event) {
    if (event.target.classList.contains('return-btn')) {
        const laptopId = event.target.getAttribute('data-id');
        const info = rentedLaptops[laptopId];

        if (info && info.length > 0) {
            const lastRental = info[info.length - 1];

            if (!lastRental.returned) {
                // 노트북 반납 처리
                lastRental.returned = true;

                // 노트북 상태와 UI 업데이트
                const laptopCell = document.getElementById(laptopId);
                laptopCell.textContent = laptopId.toUpperCase();
                laptopCell.classList.remove('unavailable');
                laptopCell.classList.add('available');
                laptopStatus[laptopId] = 'available';

                // 랜탈 카드에서 반납 상태 업데이트 및 카드 색상 복원
                const rentalCardElement = document.querySelector(`.rental-card[data-id="${laptopId}"]`);
                if (rentalCardElement) {
                    rentalCardElement.classList.remove('overdue-card');
                }
                
                // 랜탈 카드 제거
                const rentalCard = document.querySelector(`.rental-card .return-btn[data-id="${laptopId}"]`).parentElement;
                rentalCard.remove(); // 카드 제거

                event.target.disabled = true; // 버튼 비활성화
            }
        }
    }
});

// 대여 폼을 표시
document.getElementById('show-form-btn').addEventListener('click', function() {
    document.getElementById('form-container').classList.remove('hidden');
    document.getElementById('modal-overlay').style.display = 'block';
    updateCheckboxState();
});

// 배경 클릭 시 모달 숨기기
document.getElementById('modal-overlay').addEventListener('click', function() {
    document.getElementById('form-container').classList.add('hidden');
    document.getElementById('info-modal').classList.add('hidden');
    document.getElementById('modal-overlay').style.display = 'none';
});

// 각 td 클릭 시 모달창 띄우기
document.querySelectorAll('.laptop-status td').forEach(td => {
    td.addEventListener('click', function() {
        const laptopId = this.getAttribute('data-id');
        const info = rentedLaptops[laptopId];

        if (info && info.length > 0) {
            // 대여 정보를 날짜별로 그룹화
            const groupedInfo = info.reduce((acc, rental) => {
                const date = rental.rentalDateTime.toLocaleDateString();  // 날짜 형식 수정
                if (!acc[date]) acc[date] = [];
                acc[date].push(rental);
                return acc;
            }, {});

            // 모달에 대여 정보 표시
            const rentalInfo = Object.entries(groupedInfo).map(([date, rentals]) => {
                const rentalDetails = rentals.map((rental, index) => `
                    <div class="rental-info-block">
                        <button class="toggle-details-btn" data-index="${index}">${rental.rentalDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</button>
                        <div class="rental-info-details hidden" id="info-${index}">
                            <p><strong>담당 교사:</strong> ${rental.teacher}</p>
                            <p><strong>대여시간:</strong> ${rental.rentalDateTime.toLocaleString()}</p>
                            <p><strong>과목:</strong> ${rental.subject}</p>
                            <p><strong>반납여부:</strong> ${rental.returned ? '반납됨' : '미반납'}</p>
                        </div>
                    </div>
                `).join('<hr/>');
                return `
                    <h3>${date}</h3>
                    <div class="rental-info-container">
                        ${rentalDetails}
                    </div>
                `;
            }).join('<hr/>');

            document.getElementById('modal-content').innerHTML = `
                <h2>${laptopId.toUpperCase()} 대여 정보</h2>
                ${rentalInfo}
            `;
            document.getElementById('info-modal').classList.remove('hidden');
            document.getElementById('modal-overlay').style.display = 'block';

            // '상세보기' 버튼 클릭 시 해당 정보 블록 토글
            document.querySelectorAll('.toggle-details-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const index = this.getAttribute('data-index');
                    const infoBlock = document.getElementById(`info-${index}`);
                    infoBlock.classList.toggle('hidden');
                });
            });
        } else {
            const modalContent = `
                <h2>${laptopId.toUpperCase()} 대여 정보</h2>
                <p>대여 정보가 없습니다.</p>
            `;
            document.getElementById('modal-content').innerHTML = modalContent;
            document.getElementById('info-modal').classList.remove('hidden');
            document.getElementById('modal-overlay').style.display = 'block';
        }
    });
});

// 모달 닫기 버튼 클릭 시 모달 숨기기
document.getElementById('modal-close-btn').addEventListener('click', function() {
    document.getElementById('info-modal').classList.add('hidden');
    document.getElementById('modal-overlay').style.display = 'none';
});

// 체크박스 상태 업데이트
function updateCheckboxState() {
    document.querySelectorAll('#laptop-number input').forEach(checkbox => {
        const laptopId = checkbox.value;
        if (laptopStatus[laptopId] === 'unavailable') {
            checkbox.disabled = true;
            checkbox.parentElement.classList.add('disabled');
        } else {
            checkbox.disabled = false;
            checkbox.parentElement.classList.remove('disabled');
        }
    });
}
