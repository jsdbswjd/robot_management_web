// static/js/dashboard.js

/**
 * 서버(Flask)로부터 로봇의 최신 상태를 가져와 화면을 갱신합니다.
 */
async function updateRealtimeDashboard() {
    try {
        // 1. Flask API 호출 (팀원이 만들 엔드포인트)
        const response = await fetch('/api/status');

        if (!response.ok) {
            console.warn("서버 응답 없음: Flask가 실행 중인지 확인하세요.");
            return;
        }

        const data = await response.json();

        // 2. [Robot Info] 영역 업데이트
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

        // 3. [System Status] 영역 업데이트 (수정된 ID 기준)
        if (document.getElementById('stat-battery'))
            document.getElementById('stat-battery').innerText = data.battery_percent.toFixed(1) + '%';
        if (document.getElementById('stat-voltage'))
            document.getElementById('stat-voltage').innerText = data.battery_voltage + 'v';
        if (document.getElementById('stat-cpu'))
            document.getElementById('stat-cpu').innerText = data.cpu_usage + '%';
        if (document.getElementById('stat-mem'))
            document.getElementById('stat-mem').innerText = data.memory_usage + '%';

        // 4. [로봇 상태] 텍스트 및 스타일 제어
        const statusEl = document.getElementById('stat-status');
        if (statusEl) {
            statusEl.innerText = data.status.toUpperCase();

            // 상태별 색상 가이드
            if (data.status === 'moving') {
                statusEl.style.color = '#2ecc71'; // 이동 중 (초록)
            } else if (data.status === 'error') {
                statusEl.style.color = '#e74c3c'; // 에러 (빨강)
            } else {
                statusEl.style.color = '#3498db'; // 대기/충전 (파랑)
            }
        }

        // 5. [Latency] 값 업데이트 (선택 사항)
        const latencyEl = document.querySelector('.latency-value');
        if (latencyEl && data.latency_total) {
            latencyEl.innerText = data.latency_total + ' ms';
        }

        // 6. 배터리 및 시스템 상태
        if (document.getElementById('stat-battery')) 
            document.getElementById('stat-battery').innerText = `${data.battery_percent}%`;
        
        // 7. 좌표 업데이트 (HTML ID: pos-x, pos-y와 매칭)
        if (document.getElementById('pos-x')) 
            document.getElementById('pos-x').innerText = data.location.x.toFixed(1);
        if (document.getElementById('pos-y')) 
            document.getElementById('pos-y').innerText = data.location.y.toFixed(1);

        // 8. 층수 및 속도 (서버 데이터 우선)
        if (document.getElementById('info-floor')) 
            document.getElementById('info-floor').innerText = data.location.floor;
        if (document.getElementById('info-speed')) 
            document.getElementById('info-speed').innerText = data.speed.toFixed(2);

    } catch (error) {
        // 서버 연결 실패 시 콘솔에 에러 기록
        console.error("Dashboard Sync Error:", error);
    }
}

// 1초마다 데이터 폴링 (Polling)
setInterval(updateRealtimeDashboard, 1000);

// 페이지 로드 시 즉시 실행
window.onload = updateRealtimeDashboard;
