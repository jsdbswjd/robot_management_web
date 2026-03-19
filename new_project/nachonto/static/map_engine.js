// map_engine.js
const canvas = document.getElementById('floorMap');
const ctx = canvas.getContext('2d');
const mapContainer = document.getElementById('map-container');
const mapTitle = document.getElementById('map-title');

let currentFloor = '1F';

// 층별 도면 데이터 (주차장, 로비, 사무실 등 구분)
const layouts = {
    parking: [{x: 80, y: 50, w: 300, h: 40}, {x: 450, y: 50, w: 300, h: 40}, {x: 80, y: 200, w: 300, h: 40}, {x: 450, y: 200, w: 300, h: 40}],
    lobby: [{x: 350, y: 120, w: 150, h: 60}, {x: 100, y: 100, w: 40, h: 40}, {x: 700, y: 200, w: 40, h: 40}],
    office: [{x: 100, y: 60, w: 60, h: 60}, {x: 200, y: 60, w: 60, h: 60}, {x: 500, y: 60, w: 200, h: 180}],
    lab: [{x: 50, y: 40, w: 250, h: 80}, {x: 350, y: 180, w: 250, h: 80}],
    executive: [{x: 80, y: 80, w: 300, h: 150}, {x: 450, y: 80, w: 270, h: 150}]
};

const floorData = {
    'B3F': layouts.parking, 'B2F': layouts.parking, 'B1F': layouts.parking,
    '1F': layouts.lobby,
    '2F': layouts.office, '3F': layouts.office, '4F': layouts.office,
    '5F': layouts.lab, '6F': layouts.lab, '7F': layouts.lab,
    '8F': layouts.executive, '9F': layouts.executive, '10F': layouts.executive
};

function resizeCanvas() {
    canvas.width = mapContainer.clientWidth;
    canvas.height = mapContainer.clientHeight;
    drawMap();
}
window.addEventListener('resize', resizeCanvas);

function drawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 그리드
    ctx.strokeStyle = '#e0e0e0';
    for (let i = 0; i < canvas.width; i += 30) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke(); }
    for (let i = 0; i < canvas.height; i += 30) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke(); }
    // 외벽
    ctx.strokeStyle = '#2c3e50'; ctx.lineWidth = 5;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40); 
    // 내부 벽
    const obstacles = floorData[currentFloor] || layouts.lobby;
    ctx.fillStyle = '#95a5a6';
    obstacles.forEach(obs => ctx.fillRect(obs.x, obs.y, obs.w, obs.h));
    // 로봇
    ctx.font = '24px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('🤖', canvas.width / 2, canvas.height / 2);
}

// ★ 층수 클릭 시 로그 초기화 연동
const floorItems = document.querySelectorAll('.floor-nav li');
floorItems.forEach(item => {
    item.addEventListener('click', (e) => {
        floorItems.forEach(li => li.classList.remove('active'));
        e.target.classList.add('active');

        currentFloor = e.target.innerText;
        mapTitle.innerText = `Map View - ${currentFloor}`;

        drawMap();

        // 1. 로그를 싹 지웁니다.
        clearLog(); 
        // 2. 초기화 완료 로그를 한 줄 남깁니다.
        addLog('정상', `[${currentFloor}] 층 시스템 초기화 완료`);
    });
});

setTimeout(resizeCanvas, 100);
