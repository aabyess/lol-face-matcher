import face_recognition
import os
import json

# 챔피언 이미지 폴더
CHAMPIONS_FOLDER = "champions"
# 특징 저장할 JSON
OUTPUT_JSON = "champion_encodings.json"
# 모델 파일 경로
SHAPE_PREDICTOR_PATH = "models/shape_predictor_68_face_landmarks.dat"
FACE_RECOGNITION_MODEL_PATH = "models/dlib_face_recognition_resnet_model_v1.dat"

def generate_champion_encodings():
    champion_encodings = {}

    for filename in os.listdir(CHAMPIONS_FOLDER):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            champion_name = os.path.splitext(filename)[0]
            image_path = os.path.join(CHAMPIONS_FOLDER, filename)

            image = face_recognition.load_image_file(image_path)

            # 얼굴 위치 탐지 (landmarks 모델 경로 직접 설정)
            face_locations = face_recognition.face_locations(image, model="hog")
            face_landmarks_list = face_recognition.face_landmarks(image, model="large")

            # 얼굴 인코딩 (모델 경로를 직접 지정)
            encodings = face_recognition.face_encodings(
                image,
                known_face_locations=face_locations,
                num_jitters=1,
                model="large"
            )

            if len(encodings) == 0:
                print(f"[경고] {champion_name} 이미지에서 얼굴을 찾을 수 없습니다.")
                continue

            champion_encodings[champion_name] = encodings[0].tolist()
            print(f"[성공] {champion_name} 얼굴 특징 추출 완료.")

    # JSON 파일로 저장
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(champion_encodings, f, ensure_ascii=False, indent=4)
    print(f"\n[완료] 총 {len(champion_encodings)}개 챔피언 특징 저장 완료!")

if __name__ == "__main__":
    generate_champion_encodings()
