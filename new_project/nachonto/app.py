from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import os

try:
    from models.robot_state import robot_manager
except ImportError:

    print("Error: models/robot_state.py 파일을 찾을 수 없습니다.")

app = Flask(__name__,
            static_folder='static',
            template_folder='templates')

CORS(app)

# 1. 메인 대시보드 페이지 (index.html 띄우기)
@app.route('/')
def index():
    return render_template('index.html')

# 2. 로봇 상태 데이터 API (JS에서 1초마다 호출할 곳)
@app.route('/api/status', methods=['GET'])
def get_robot_status():
    """
    robot_state.py의 robot_manager에서 실시간 데이터를 가져와
    JSON 형식으로 브라우저에 보내줍니다.
    """
    return jsonify(robot_manager.get_current_state())

# 3. 로봇 제어 API (조이스틱이나 버튼 클릭 시 호출)
@app.route('/api/control', methods=['POST'])
def control_robot():
    """
    브라우저에서 보낸 명령(move, stop 등)을 받아
    robot_manager의 상태를 변경합니다.
    """
    command = request.json
    result = robot_manager.update_command(command)
    return jsonify(result)

@app.route('/move', methods=['POST'])
def move_robot():
    direction = request.json.get('direction')
    # 여기서 실제로 robot.x, robot.y 값을 업데이트하고 있는지 확인!
    # 업데이트된 좌표를 return해줘야 프론트에서 바로 쓸 수 있습니다.
    new_coords = update_position(direction) 
    return jsonify({"status": "success", "coords": new_coords})

if __name__ == '__main__':
    # host='0.0.0.0'으로 설정해야 다른 기기에서도 접속 가능합니다.
    # debug=True는 코드 수정 시 서버가 자동으로 재시작되게 합니다.
    app.run(host='0.0.0.0', port=8000, debug=True)
