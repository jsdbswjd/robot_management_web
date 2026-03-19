# models/robot_state.py

import threading
import time
import random

class RobotManager:
    def __init__(self):
        # 로봇의 초기 상태 (좌표는 지도 중앙 부근인 400, 300으로 설정 권장)
        self.state = {
            "robot_id": "RBT-001",
            "status": "idle", # 'idle', 'moving', 'error'
            "direction": None, # [추가] 현재 이동 방향 (up, down, left, right)
            "location": {"floor": "1F", "x": 400.0, "y": 300.0},
            "battery_percent": 100.0,
            "battery_voltage": 24.5,
            "speed": 0.0,
            "cpu_usage": 15,
            "memory_usage": 42,
            "latency_total": 12
        }
        # 백그라운드 업데이트 스레드 시작
        self.update_thread = threading.Thread(target=self._update_loop, daemon=True)
        self.update_thread.start()

    def get_current_state(self):
        """현재 로봇 상태 반환"""
        return self.state

    def _update_loop(self):
        """1초마다 로봇의 상태(좌표, 배터리 등)를 시뮬레이션 업데이트"""
        while True:
            # 1. 이동 로직 (방향에 따른 좌표 계산)
            if self.state["status"] == "moving":
                self.state["speed"] = 1.5  # 이동 중일 때 속도 설정
                direct = self.state.get("direction")
                step = 10.0 # 한 번 이동 시 움직일 거리 (픽셀 단위)

                # 방향별 좌표 업데이트 (캔버스 좌표계 기준: 위로 갈수록 y 감소)
                if direct == 'up':
                    self.state["location"]["y"] -= step
                elif direct == 'down':
                    self.state["location"]["y"] += step
                elif direct == 'left':
                    self.state["location"]["x"] -= step
                elif direct == 'right':
                    self.state["location"]["x"] += step

                # 이동 시 배터리 더 빠르게 소모
                self.state["battery_percent"] -= 0.05
            else:
                self.state["speed"] = 0.0
                # 대기 중일 때 미세한 배터리 소모
                self.state["battery_percent"] -= 0.01

            # 2. 배터리 전압 및 기타 수치 랜덤 시뮬레이션 (기존 로직 유지)
            self.state["battery_voltage"] = round(24.0 + random.uniform(0, 0.5), 1)
            self.state["cpu_usage"] = random.randint(10, 30)
            self.state["latency_total"] = random.randint(8, 20)

            # 배터리가 0 미만으로 떨어지지 않게 보호
            if self.state["battery_percent"] < 0:
                self.state["battery_percent"] = 0
                self.state["status"] = "error"

            # 0.2초마다 업데이트 (값이 너무 튀지 않게 조절)
            time.sleep(0.2)

# 전역 객체 생성
robot_manager = RobotManager()
