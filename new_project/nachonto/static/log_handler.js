// log_handler.js

// 1. 로그 추가 함수
function addLog(type, message) {
    const tbody = document.querySelector('.log-table tbody');
    if (!tbody) return;

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0]; 
    let statusClass = type === '정상' ? 'status-ok' : 'status-warn';

    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${timeStr}</td>
        <td class="${statusClass}">${type}</td>
        <td>${message}</td>
    `;
    
    // 가장 위에 추가
    tbody.prepend(tr);

    // 로그 개수 제한 (최근 10개만 유지)
    if(tbody.children.length > 10) {
        tbody.lastChild.remove();
    }
}

// 2. 로그 전체 삭제 함수 (★ 중요: 이 함수가 반드시 있어야 합니다)
function clearLog() {
    const tbody = document.querySelector('.log-table tbody');
    if (tbody) {
        tbody.innerHTML = ''; 
    }
}
