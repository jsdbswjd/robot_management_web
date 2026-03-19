// robot_control.js
// 위에서 만든 addLog 함수를 끌어다 씁니다.
document.getElementById('btn-charge').addEventListener('click', () => addLog('정상', '충전소 이동 명령 하달'));
document.getElementById('btn-tts').addEventListener('click', () => addLog('정상', 'TTS 안내 방송 테스트'));
document.getElementById('btn-open').addEventListener('click', () => addLog('정상', '적재함 개방 완료'));
document.getElementById('btn-start-pos').addEventListener('click', () => addLog('정상', '시작 위치 재설정됨'));
document.getElementById('btn-pause').addEventListener('click', () => addLog('주의', '로봇 강제 일시정지'));
document.getElementById('btn-restart').addEventListener('click', () => addLog('정상', '서비스 재시작 중...'));
document.getElementById('btn-shutdown').addEventListener('click', () => addLog('주의', '시스템 종료 시퀀스 가동'));
