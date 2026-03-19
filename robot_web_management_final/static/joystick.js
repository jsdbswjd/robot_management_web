// joystick.js

// 1. 서버로 이동/정지 명령을 보내는 공통 함수
// [수정] direction 파라미터를 추가하여 어떤 방향인지 서버에 전달합니다.
async function sendRobotCommand(action, direction = null) {
    try {
        const response = await fetch('/api/robot/control', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // [수정] body에 direction 정보를 포함하여 전송합니다.
            body: JSON.stringify({
                action: action,
                direction: direction
            })
        });

        if (!response.ok) {
            console.error("서버 응답 오류:", response.status);
            return;
        }

        const result = await response.json();
        console.log("로봇 상태 변경 결과:", result);
    } catch (error) {
        console.error("네트워크 오류 또는 서버가 꺼져 있습니다:", error);
    }
}

// 2. 방향키 버튼 이벤트 리스너 (로그 출력 + 서버 명령 전송)
document.getElementById('joy-up').addEventListener('click', () => {
    addLog('정상', '수동 제어: 전진 (↑)');
    // [수정] 'up' 방향 정보를 함께 보냅니다.
    sendRobotCommand('move', 'up');
});

document.getElementById('joy-down').addEventListener('click', () => {
    addLog('정상', '수동 제어: 후진 (↓)');
    // [수정] 'down' 방향 정보를 함께 보냅니다.
    sendRobotCommand('move', 'down');
});

document.getElementById('joy-left').addEventListener('click', () => {
    addLog('정상', '수동 제어: 좌회전 (←)');
    // [수정] 'left' 방향 정보를 함께 보냅니다.
    sendRobotCommand('move', 'left');
});

document.getElementById('joy-right').addEventListener('click', () => {
    addLog('정상', '수동 제어: 우회전 (→)');
    // [수정] 'right' 방향 정보를 함께 보냅니다.
    sendRobotCommand('move', 'right');
});

// 3. 중앙 정지 버튼(■) 이벤트 리스너 (로그 출력 + 서버 명령 전송)
document.getElementById('joy-stop').addEventListener('click', () => {
    addLog('주의', '수동 제어: 긴급 정지 (■)');
    // 정지 시에는 방향이 필요 없으므로 action만 보냅니다.
    sendRobotCommand('stop');
});
