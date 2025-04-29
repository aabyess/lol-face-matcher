import React, { useState } from 'react';
import { Upload, message, Card, Typography, Button } from 'antd';
import { InboxOutlined, ReloadOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import TimoBackground from './assets/Timo.png';

const { Dragger } = Upload;
const { Title, Text } = Typography;

const App = () => {
  const [result, setResult] = useState(null);

  const uploadProps = {
    name: 'file',
    multiple: false,
    action: 'http://localhost:8000/upload',
    showUploadList: false,
    onChange(info) {
      const { status, response } = info.file;

      if (status === 'done') {
        message.success(`${info.file.name} 업로드 성공!`);

        if (response) {
          if (response.match) {
            setResult(response);
          } else if (response.error) {
            message.warning('얼굴을 찾을 수 없습니다.');
            setResult(null);
          }
        }
      } else if (status === 'error') {
        message.error(`${info.file.name} 업로드 실패.`);
        setResult(null);
      }
    },
  };

  const resetResult = () => {
    setResult(null);
  };

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundImage: `url(${TimoBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '600px',
          textAlign: 'center',
          padding: '40px',
          backgroundColor: 'rgba(255,255,255,0.9)',
          borderRadius: '8px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
        }}
      >
        <Title level={2}>리그 챔피언 닮은꼴 찾기</Title>

        {!result ? (
          <Dragger {...uploadProps} style={{ padding: '30px' }}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ fontSize: '48px', color: '#40a9ff' }} />
            </p>
            <p>사진 파일을 여기에 드래그하거나 클릭하세요</p>
            <p>JPG, PNG 등 이미지 파일만 업로드 가능합니다.</p>
          </Dragger>
        ) : (
          <Card
            style={{ marginTop: '30px', padding: '20px' }}
            cover={
              <img
                alt={result.match}
                src={`/champions/${result.match}.png`}
                style={{ width: '100%', maxHeight: '350px', objectFit: 'cover' }}
              />
            }
          >
            <Title level={4}>{result.match}</Title>
            <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>
              매칭률: {result.confidence}
            </Text>
            <br />
            <Button 
              type="primary" 
              icon={<ReloadOutlined />} 
              style={{ marginTop: '20px' }}
              onClick={resetResult}
            >
              다시 테스트 하기
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default App;
