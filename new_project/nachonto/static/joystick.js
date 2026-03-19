// joystick.js

// 서버로 명령을 보내는 핵심 함수
function sendMoveCommand(direction) {
    fetch('/api/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'move', direction: direction })
    })
    .then(res => res.json())
    .then(data => {
        // 서버 응답 후 로그 기록
        addLog('정상', `수동 제어: ${direction} (명령 전송 완료)`);
    })
    .catch(err => console.error("명령 전송 실패:", err));
}

// [수정 포인트] 클릭 시 sendMoveCommand를 호출하도록 바꿉니다.
document.getElementById('joy-up').addEventListener('click', () => {
    sendMoveCommand('up');
});

document.getElementById('joy-down').addEventListener('click', () => {
    sendMoveCommand('down');
});

document.getElementById('joy-left').addEventListener('click', () => {
    sendMoveCommand('left');
});

document.getElementById('joy-right').addEventListener('click', () => {
    sendMoveCommand('right');
});

document.getElementById('joy-stop').addEventListener('click', () => {
    fetch('/api/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'stop' })
    });
    addLog('주의', '긴급 정지 실행');
});