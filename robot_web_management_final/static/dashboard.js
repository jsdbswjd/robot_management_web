// static/js/dashboard.js

// [추가] 레이턴시 데이터를 저장할 배열 (최근 20개 데이터)
let latencyHistory = [];
const MAX_DATA_POINTS = 20;

/**
 * 레이턴시 실시간 그래프를 그리는 함수
 */
function drawLatencyGraph(newValue) {
    const canvas = document.getElementById('latencyGraph');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // 데이터 업데이트
    latencyHistory.push(newValue);
    if (latencyHistory.length > MAX_DATA_POINTS) {
        latencyHistory.shift();
    }

    // 캔버스 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 배경 가이드라인 (선택 사항)
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    // 그래프 그리기
    ctx.beginPath();
    ctx.strokeStyle = '#3498db'; // 로봇 상태 색상과 맞춤
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';

    const stepX = canvas.width / (MAX_DATA_POINTS - 1);

    latencyHistory.forEach((val, i) => {
        // 레이턴시 값에 따른 Y 좌표 계산 (값이 클수록 위로, 최대 100ms 기준)
        const y = canvas.height - (val / 100 * canvas.height);
        const x = i * stepX;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });

    ctx.stroke();
}

/**
 * 서버(Flask)로부터 로봇의 최신 상태를 가져와 화면을 갱신합니다.
 */
async function updateRealtimeDashboard() {
    try {
        const response = await fetch('/api/robot/status');

        if (!response.ok) {
            console.warn("서버 응답 없음: Flask가 실행 중인지 확인하세요.");
            return;
        }

        const data = await response.json();

        // [기존 유지] map_engine.js 연동
        if (typeof updateRobotPosition === 'function') {
            updateRobotPosition(data.location.x, data.location.y);
        }

        // 2. [Robot Info] 영역 업데이트 (기존 유지)
        if (document.getElementById('robot-id'))
            document.getElementById('robot-id').innerText = data.robot_id;
        if (document.getElementById('info-floor'))
            document.getElementById('info-floor').innerText = data.location.floor;
        if (document.getElementById('pos-x'))
            document.getElementById('pos-x').innerText = data.location.x.toFixed(1);
        if (document.getElementById('pos-y'))
            document.getElementById('pos-y').innerText = data.location.y.toFixed(1);
        if (document.getElementById('info-speed'))
            document.getElementById('info-speed').innerText = data.speed.toFixed(2);

        // 3. [System Status] 영역 업데이트 (기존 유지)
        if (document.getElementById('stat-battery'))
            document.getElementById('stat-battery').innerText = data.battery_percent.toFixed(1) + '%';
        if (document.getElementById('stat-voltage'))
            document.getElementById('stat-voltage').innerText = data.battery_voltage + 'v';
        if (document.getElementById('stat-cpu'))
            document.getElementById('stat-cpu').innerText = data.cpu_usage + '%';
        if (document.getElementById('stat-mem'))
            document.getElementById('stat-mem').innerText = data.memory_usage + '%';

        // 4. [로봇 상태] 텍스트 및 스타일 제어 (기존 유지)
        const statusEl = document.getElementById('stat-status');
        if (statusEl) {
            statusEl.innerText = data.status.toUpperCase();
            if (data.status === 'moving') statusEl.style.color = '#2ecc71';
            else if (data.status === 'error') statusEl.style.color = '#e74c3c';
            else statusEl.style.color = '#3498db';
        }

        // 5. [Latency] 값 업데이트 및 그래프 그리기
        const latencyEl = document.querySelector('.latency-value');
        if (latencyEl && data.latency_total) {
            const lValue = data.latency_total;
            latencyEl.innerText = lValue + ' ms';

            // [추가] 실시간 그래프 업데이트 함수 호출
            drawLatencyGraph(lValue);

        }

    } catch (error) {
        console.error("Dashboard Sync Error:", error);
    }
}

// 1초마다 데이터 폴링
setInterval(updateRealtimeDashboard, 1000);
window.onload = updateRealtimeDashboard;
