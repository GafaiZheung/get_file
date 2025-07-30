

import React, { useRef, useState } from 'react';
import './App.css';
import { UPLOAD_URL } from './config';

const acceptTypes = '.xlsx,.xls,.csv';



function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadUrl] = useState(UPLOAD_URL);
  const inputRef = useRef(null);



  const handleChange = (e) => {
    const selected = e.target.files[0];
    if (selected && !acceptTypes.includes(selected.name.split('.').pop().toLowerCase())) {
      setMessage('仅支持上传xlsx、xls、csv文件');
      setFile(null);
      return;
    }
    setFile(selected);
    setMessage('');
    setUploadSuccess(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleChange({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleBoxClick = () => {
    if (inputRef.current) inputRef.current.click();
  };

  const handleUpload = async () => {
    if (uploadSuccess) {
      setFile(null);
      setMessage('');
      setUploadSuccess(false);
      setProgress(0);
      return;
    }
    if (!file) {
      setMessage('请选择文件');
      return;
    }
    setUploading(true);
    setProgress(0);
    const formData = new FormData();
    formData.append('file', file);
    // 用 XMLHttpRequest 以支持进度条
    const xhr = new XMLHttpRequest();
    xhr.open('POST', uploadUrl, true);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () => {
      setUploading(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        setUploadSuccess(true);
        setMessage('');
      } else {
        setMessage('上传失败');
      }
    };
    xhr.onerror = () => {
      setUploading(false);
      setMessage('网络错误');
    };
    xhr.send(formData);
  };

  return (
    <div className="upload-container">
      <h2 className="upload-title">货代返回订单列表上传</h2>
      {uploadSuccess ? (
        <div className="upload-drag success">
          <div className="upload-success-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="22" fill="#fff" stroke="#52c41a" strokeWidth="4"/>
              <path d="M16 25.5L22 31L33 19" stroke="#52c41a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="upload-success-text">上传成功</div>
        </div>
      ) : (
        <div
          className={`upload-drag${dragActive ? ' drag-active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBoxClick}
        >
          <input
            type="file"
            accept={acceptTypes}
            onChange={handleChange}
            className="upload-input"
            ref={inputRef}
            style={{ display: 'none' }}
            disabled={uploading}
          />
          <div className="upload-plus">+</div>
          <div className="upload-drag-text">
            {file ? file.name : '拖拽文件到此或点击加号选择'}
          </div>
          {uploading && (
            <div className="upload-progress-bar">
              <div className="upload-progress-inner" style={{ width: `${progress}%` }} />
              <span className="upload-progress-text">{progress}%</span>
            </div>
          )}
        </div>
      )}
      <button className="upload-btn" onClick={handleUpload} style={{ marginTop: 18 }} disabled={uploading}>
        {uploadSuccess ? '继续上传' : uploading ? '上传中...' : '上传'}
      </button>
      {message && <p className="upload-msg">{message}</p>}
      <div className="upload-tip">仅支持 .xlsx、.xls、.csv 文件</div>
    </div>
  );
}

export default App;
