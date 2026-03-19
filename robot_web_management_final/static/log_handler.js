// static/js/log_handler.js

/**
 * 화면에 로그를 추가하고, 동시에 MariaDB에 저장하기 위해 서버로 전송합니다.
 * @param {string} level - 로그 레벨 ('정상', '주의', '에러')
 * @param {string} message - 로그 내용
 */
function addLog(level, message) {
    const tbody = document.querySelector('.log-table tbody');
    const now = new Date();

    // 1. 시간 문자열 생성 (HH:MM:SS)
    const timeStr = now.getHours().toString().padStart(2, '0') + ':' +
                    now.getMinutes().toString().padStart(2, '0') + ':' +
                    now.getSeconds().toString().padStart(2, '0');

    // 2. 화면(HTML)에 로그 행 추가 (기존 로직 유지)
    const tr = document.createElement('tr');

    // 레벨에 따른 배지 색상 클래스 설정 (기존 style.css 연동)
    let badgeClass = 'info';
    if (level === '주의') badgeClass = 'warning';
    else if (level === '에러') badgeClass = 'danger';

    tr.innerHTML = `
        <td>${timeStr}</td>
        <td><span class="badge ${badgeClass}">${level}</span></td>
        <td>${message}</td>
    `;

    // 최신 로그가 가장 위로 오도록 삽입
    if (tbody.firstChild) {
        tbody.insertBefore(tr, tbody.firstChild);
    } else {
        tbody.appendChild(tr);
    }

    // 3. [추가] MariaDB 저장을 위한 서버 API 호출 (비동기)
    // app.py에 추가한 /api/logs 엔드포인트로 데이터를 보냅니다.
    fetch('/api/logs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            level: level,
            message: message
        })
    })
    .then(response => {
        if (!response.ok) {
            console.warn("DB 로그 저장 실패 (서버 응답 오류)");
        }
    })
    .catch(error => {
        console.error("DB 로그 저장 중 네트워크 오류 발생:", error);
    });
}

/**
 * 로그 테이블의 모든 내용을 삭제합니다. (층 변경 시 호출 등)
 */
function clearLog() {
    const tbody = document.querySelector('.log-table tbody');
    if (tbody) {
        tbody.innerHTML = '';
    }
}
