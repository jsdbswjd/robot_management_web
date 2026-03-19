// elevator_sim.js

let elevatorData = {
    currentFloor: '1F',
    targetFloor: '1F',
    currentSpeed: 0.0,
    maxSpeed: 1.5,      // 설정하신 최대 속도
    occupancy: 5,       // 현재 인원
    maxCapacity: 15,    // 설정하신 최대 정원
    isMoving: false
};

const speedEl = document.getElementById('info-speed');
const occEl = document.getElementById('info-occ');
const floorEl = document.getElementById('info-floor');

// 1. UI 업데이트 함수
function updateElevatorUI() {
    if (speedEl) speedEl.innerText = elevatorData.currentSpeed.toFixed(2);
    if (occEl) occEl.innerText = elevatorData.occupancy;
    if (floorEl) floorEl.innerText = elevatorData.currentFloor;
}

// 2. 시뮬레이션 루프 (0.5초마다 실행)
setInterval(() => {
    // 가. 정원 변화 (랜덤하게 탑승/하차, 정원 15명 준수)
    if (Math.random() > 0.7) {
        let change = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
        elevatorData.occupancy = Math.max(0, Math.min(elevatorData.maxCapacity, elevatorData.occupancy + change));
    }

    // 나. 속도 변화 로직
    if (elevatorData.isMoving) {
        // 이동 중: 최대 속도까지 가속 후 유지 (미세한 떨림 효과)
        if (elevatorData.currentSpeed < elevatorData.maxSpeed) {
            elevatorData.currentSpeed += 0.2;
        } else {
            elevatorData.currentSpeed = elevatorData.maxSpeed + (Math.random() * 0.04 - 0.02);
        }
    } else {
        // 정지 중: 속도 감속
        if (elevatorData.currentSpeed > 0) {
            elevatorData.currentSpeed -= 0.3;
            if (elevatorData.currentSpeed < 0) elevatorData.currentSpeed = 0;
        }
    }

    updateElevatorUI();
}, 500);

// 3. 층수 선택 시 이동 시뮬레이션 연동
document.querySelectorAll('.floor-nav li').forEach(item => {
    item.addEventListener('click', () => {
        const selectedFloor = item.innerText;

        if (selectedFloor !== elevatorData.currentFloor) {
            elevatorData.targetFloor = selectedFloor;
            elevatorData.isMoving = true;

            // 실제 이동 느낌을 위해 3초 후 목적지 도착 가정
            setTimeout(() => {
                elevatorData.currentFloor = selectedFloor;
                elevatorData.isMoving = false;
                fetch('/api/control', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'update_floor', floor: selectedFloor })
                });
                addLog('정상', `엘리베이터 L04가 ${selectedFloor}에 도착했습니다.`);
            }, 3000);
        }
    });
});
