import React from 'react';
import { Upload, message, Card } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

const props = {
  name: 'file',
  multiple: false,
  action: 'http://localhost:8000/upload',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} 파일 업로드 성공.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} 파일 업로드 실패.`);
    }
  },
};

export default function App() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <Card title="사진을 올려주세요" style={{ width: 400 }}>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">여기를 클릭하거나 사진을 드래그하세요</p>
          <p className="ant-upload-hint">한 번에 하나의 사진만 업로드 가능합니다.</p>
        </Dragger>
      </Card>
    </div>
  );
}
