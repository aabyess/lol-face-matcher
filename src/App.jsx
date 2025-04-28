import React from 'react';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';

const { Dragger } = Upload;

const props = {
  name: 'file',
  multiple: false,
  action: 'http://localhost:8000/upload',
  onChange(info) {
    const { status, response } = info.file;
  
    if (status === 'done') {
      message.success(`${info.file.name} 파일 업로드 성공.`);
  
      if (response) {
        console.log('서버 응답:', response);  // 여기 추가! ✅
        
        if (response.match) {
          message.info(`닮은 챔피언: ${response.match}\n매칭 확률: ${response.confidence}`);
        } else if (response.error) {
          message.warning('얼굴을 찾을 수 없습니다.');
        }
      }
    } else if (status === 'error') {
      message.error(`${info.file.name} 파일 업로드 실패.`);
    }
  }
  
};

const App = () => {
  return (
    <div style={{ width: '500px', margin: '100px auto' }}>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">사진 파일을 여기에 업로드하세요</p>
        <p className="ant-upload-hint">
          JPG, PNG 등 이미지 파일만 업로드 가능합니다.
        </p>
      </Dragger>
    </div>
  );
};

export default App;
