<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NARCHON Dashboard</title>
    <link rel="stylesheet" href="static/style.css">
</head>
<body>
    <div class="app-container">
        <?php include 'components/sidebar.php'; ?>

        <main class="main-wrapper">
            <?php include 'components/header.php'; ?>

            <div class="content-grid">
                <div class="box robot-info">
                    <div class="info-header">
                        <h2>SEONGSU_03 ⌄</h2>
                        <div class="on-off-status"><span class="on">on <strong>14</strong></span><span class="off">off <strong>0</strong></span></div>
                    </div>
                    <div class="info-details">
                        <p>📍 🗺️</p>
                        <p>Elevator : L04 &nbsp; Floor <span id="info-floor">B1F</span></p>
                        <p>Occupancy : <span id="info-occ">5</span> / 15 명</p>
                        <p class="speed"><span id="info-speed">0.00</span> m/s</p>
                    </div>
                </div>
                
                <div class="box system-status">
                    <div class="status-item">배터리 잔량 <strong>98 % ⚡</strong></div>
                    <div class="status-item">배터리 전압 <strong>49 v</strong></div>
                    <div class="status-item">CPU <strong>2 %</strong></div>
                    <div class="status-item">Memory <strong>33 %</strong></div>
                </div>
                
                <?php include 'components/floor_nav.php'; ?>
                
                <div class="box map-area">
                    <div class="map-header">
                        <h3 id="map-title">Map View - 1F</h3>
                        <div class="map-controls">
                            <button>➕</button>
                            <button>➖</button>
                        </div>
                    </div>
                    <div class="map-content" id="map-container">
                        <canvas id="floorMap"></canvas>
                    </div>
                </div>
                
                <div class="box latency-graph">
                    <h3>Latency</h3><div class="latency-value">10 ms</div>
                    <div class="graph-placeholder"><div class="graph-line"></div></div>
                </div>
                <div class="box camera-view">
                    <h3>Camera View</h3>
                    <div class="camera-placeholder"><span class="cam-icon">📹</span><p>실시간 영상 대기 중...</p></div>
                </div>
                
                <div class="box log-table">
                    <h3>Scenario Monitoring Log</h3>
                    <table>
                        <thead><tr><th>시간</th><th>구분</th><th>내용</th></tr></thead>
                        <tbody></tbody> 
                    </table>
                </div>
                
                <div class="box robot-control">
                    <div class="control-tabs"><span class="active">로봇 제어</span><span>수동 제어</span><span>관리자 제어</span></div>
                    <div class="control-grid">
                        <button id="btn-charge">⚡<br>충전소 이동</button>
                        <button id="btn-tts">🔊<br>TTS 발화</button>
                        <button id="btn-open">📦<br>적재함 열기</button>
                        <button id="btn-start-pos">📍<br>위치 설정</button>
                        <button id="btn-pause" class="btn-primary">⏸️<br>일시정지</button>
                    </div>
                    <div class="control-footer">
                        <button disabled>⏻ 시나리오 종료</button><button id="btn-restart">🔄 서비스 재시작</button>
                        <button id="btn-shutdown" class="btn-dark">⏻ 시스템 종료</button>
                    </div>
                </div>
                
                <div class="box remote-control">
                    <h3>Remote Control</h3>
                    <div class="joystick">
                        <button id="joy-up" class="dir-btn up">▲</button>
                        <div class="mid-btns">
                            <button id="joy-left" class="dir-btn left">◀</button>
                            <button id="joy-stop" class="dir-btn stop">■</button>
                            <button id="joy-right" class="dir-btn right">▶</button>
                        </div>
                        <button id="joy-down" class="dir-btn down">▼</button>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script src="static/log_handler.js"></script>
    <script src="static/robot_control.js"></script>
    <script src="static/joystick.js"></script>
    <script src="static/map_engine.js"></script>
    <script src="static/elevator_sim.js"></script>
</body>
</html>
