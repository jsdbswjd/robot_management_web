import threading
import time
import random

class RobotState:
    def __init__(self):
        self.state = {
            "robot_id": "SEONGSU_03",
            "location": {"floor": "1F", "x": 100.0, "y": 200.0},
            "status": "idle",
            "speed": 0.0,
            "battery_percent": 98.0,
            "battery_voltage": 49.0,
            "cpu_usage": 2.0,
            "memory_usage": 33.0,
        }
        self.lock = threading.Lock()
        self.running = True
        # 시뮬레이션 스레드 시작
        threading.Thread(target=self._simulate_robot, daemon=True).start()

    def _simulate_robot(self):
        """자동 상태 업데이트 (배터리 소모, CPU 사용량 등)"""
        while self.running:
            with self.lock:
                # 1. 하드웨어 자원 노이즈 (항상 작동)
                self.state["cpu_usage"] = round(random.uniform(1.0, 10.0), 1)
                self.state["memory_usage"] = round(random.uniform(30.0, 35.0), 1)

                # 2. 이동 중일 때의 물리 변화
                if self.state["status"] == "moving":
                    # 이동 중엔 속도 발생 및 배터리 미세 소모
                    self.state["speed"] = round(random.uniform(0.5, 1.2), 2)
                    self.state["battery_percent"] -= 0.005
                    
                    # [중요] 자동 위치 미세 떨림 (수동 조작과 별개로 로봇이 살아있는 느낌 부여)
                    self.state["location"]["x"] += random.uniform(-0.1, 0.1)
                    self.state["location"]["y"] += random.uniform(-0.1, 0.1)
                else:
                    self.state["speed"] = 0.0
            
            time.sleep(1)

    def update_command(self, command):
        """프론트엔드 수동 제어 명령 처리"""
        with self.lock:
            action = command.get("action")
            
            if action == "move":
                direction = command.get("direction")
                self.state["status"] = "moving"
                move_step = 10.0  # 이동 거리 증가 (시각적 확인을 위해)
                
                if direction == "up":
                    self.state["location"]["y"] -= move_step
                elif direction == "down":
                    self.state["location"]["y"] += move_step
                elif direction == "left":
                    self.state["location"]["x"] -= move_step
                elif direction == "right":
                    self.state["location"]["x"] += move_step
                
                return {"status": "success", "data": self.state["location"]}

            elif action == "stop":
                self.state["status"] = "idle"
                self.state["speed"] = 0.0
                return {"status": "success"}

            elif action == "update_floor":
                new_floor = command.get("floor")
                self.state["location"]["floor"] = new_floor
                # 층이 바뀌면 보통 해당 층의 로비 중앙으로 좌표 초기화
                self.state["location"]["x"] = 100.0
                self.state["location"]["y"] = 200.0
                return {"status": "success", "floor": new_floor}

        return {"status": "error", "message": "Unknown action"}

    def get_current_state(self):
        with self.lock:
            return self.state.copy()

robot_manager = RobotState()