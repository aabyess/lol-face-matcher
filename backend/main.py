from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import face_recognition
import numpy as np
import json
import os

app = FastAPI()

# CORS 설정 (프론트엔드 연결 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JSON 파일 로딩
with open("./champions/champion_encodings.json", "r") as f:
    champion_data = json.load(f)

champion_encodings = []
champion_names = []

# 딕셔너리 형태로 되어있는 JSON 처리
for name, encoding in champion_data.items():
    champion_names.append(name)
    champion_encodings.append(np.array(encoding))

@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    contents = await file.read()

    # 업로드된 파일을 임시 저장
    with open("temp_image.jpg", "wb") as f:
        f.write(contents)

    # 얼굴 인코딩 추출
    img = face_recognition.load_image_file("temp_image.jpg")
    encodings = face_recognition.face_encodings(img)

    # 얼굴이 없을 때 처리
    if len(encodings) == 0:
        os.remove("temp_image.jpg")
        return {"error": "업로드된 사진에서 얼굴을 찾을 수 없습니다."}

    user_encoding = encodings[0]

    # 챔피언들과 비교
    distances = face_recognition.face_distance(champion_encodings, user_encoding)
    best_match_index = np.argmin(distances)

    best_champion = champion_names[best_match_index]
    confidence = (1 - distances[best_match_index]) * 100

    # 임시 파일 삭제
    os.remove("temp_image.jpg")

    return {
        "match": best_champion,
        "confidence": f"{confidence:.2f}%"
    }
