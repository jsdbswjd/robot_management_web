from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy # [추가] DB 연동을 위한 라이브러리
from datetime import datetime # [추가] 로그 시간 기록용
import os

# 1. 모델 임포트
try:
    from models.robot_state import robot_manager
except ImportError:
    print("Error: models/robot_state.py 파일을 찾을 수 없습니다.")

app = Flask(__name__,
            static_folder='static',
            template_folder='templates')

# [추가] MariaDB 연결 설정 (사용자명, 비밀번호, 호스트, DB이름 확인 필요)
# 'mysql://사용자:비밀번호@localhost/데이터베이스명'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://hwibuk:2327@localhost/robot_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# [추가] 데이터베이스 로그 테이블 모델 정의
class RobotLog(db.Model):
    __tablename__ = 'robot_logs'
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.now)
    level = db.Column(db.String(20)) # '정상', '주의', '에러'
    message = db.Column(db.Text)

    def to_dict(self):
        return {
            "id": self.id,
            "time": self.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            "level": self.level,
            "message": self.message
        }

# [추가] 테이블이 없으면 자동으로 생성하는 로직
with app.app_context():
    db.create_all()

CORS(app)

# 2. 메인 페이지 (index.html 띄우기)
@app.route('/')
def index():
    return render_template('index.html')

# 3. 로봇 상태 조회 API (JS의 dashboard.js에서 1초마다 호출)
@app.route('/api/robot/status', methods=['GET'])
def get_robot_status():
    """실시간 로봇 데이터를 반환합니다."""
    return jsonify(robot_manager.get_current_state())

# [추가] 로그 저장용 API
@app.route('/api/logs', methods=['POST'])
def save_log():
    """클라이언트에서 발생한 로그를 MariaDB에 저장합니다."""
    data = request.json
    try:
        new_log = RobotLog(
            level=data.get('level', '정상'),
            message=data.get('message', '')
        )
        db.session.add(new_log)
        db.session.commit()
        return jsonify({"result": "success"})
    except Exception as e:
        return jsonify({"result": "error", "message": str(e)}), 500

# 4. 로봇 제어 API (중복되었던 함수를 하나로 통합)
@app.route('/api/robot/control', methods=['POST'])
def control_robot():
    """조이스틱(move, stop) 및 기타 버튼 명령을 통합 처리합니다."""
    data = request.json
    action = data.get('action') # 'move', 'stop' 등
    direction = data.get('direction') # [추가된 방향 정보 수신]

    if action == 'move':
        robot_manager.state["status"] = "moving"
        robot_manager.state["direction"] = direction # [추가된 방향 정보 기록]
        return jsonify({"result": "success", "status": "moving", "direction": direction})

    elif action == 'stop':
        robot_manager.state["status"] = "idle"
        robot_manager.state["direction"] = None # 정지 시 방향 초기화
        return jsonify({"result": "success", "status": "idle"})

    return jsonify({"result": "success", "action": action})

# 5. 층수 업데이트
@app.route('/api/robot/floor', methods=['POST'])
def update_floor():
    data = request.json
    new_floor = data.get('floor')
    if new_floor:
        robot_manager.state["location"]["floor"] = new_floor
        return jsonify({"result": "success", "floor": new_floor})
    return jsonify({"result": "fail"}), 400







if __name__ == '__main__':
    # 현재 8000번 포트로 설정되어 있습니다.
    # 브라우저 접속 시 http://localhost:8000 으로 접속하세요.
    app.run(host='0.0.0.0', port=8000, debug=True)
