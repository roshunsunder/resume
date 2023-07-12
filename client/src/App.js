/*
import React, {useState, useEffect} from 'react';
import { FileUploader } from "react-drag-drop-files";
import UploadForm from './uploadFile';
import { useDropzone } from 'react-dropzone';
import './App.css';
import DarkTextBox from './darkTextBox';

const App = () => {
  const [documentContent, setDocumentContent] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [job, setJob] = useState('');

  const handleChange = (event) => {
    setJob(event.target.value);
  }

  const FileUpload = ({ onUpload }) => {
    const { getRootProps, getInputProps } = useDropzone({
      accept: '.doc, .docx',
      onDrop: (acceptedFiles) => {
        console.log("Uploading data!");
        try {
          const formData = new FormData();
          formData.append('file', acceptedFiles[0]);
          setUploadedFile(formData);
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      },
    });

    return (
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <p>Drag and drop a Word document here, or click to select a file</p>
      </div>
    );
  };


  const submitFunc = async (event) => {
    event.preventDefault();
    if (uploadedFile == null) {
      console.error('No file uploaded!');
      return;
    } else if (job === '') {
      console.error('Please include a job description!');
      return;
    }


    setDocumentContent('Loading...');
    const superForm = new FormData();
    superForm.append('job',job);
    superForm.append('file', uploadedFile.get('file'));
    try {
      const response = await fetch('/query', {
        method: 'POST',
        body : superForm
      }).then(res => res.json()).then(data => {
        setDocumentContent(data['Result'])
      });
    } catch (error) {
      console.log(error);
    }

    return;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Resume Refiner</h1>
      </header>
      <main>
        <FileUpload />
        <DarkTextBox submitFunction={submitFunc} handleChange={handleChange}/>
        {documentContent && (
          <div className="document-content">
            <h2>Processed Document</h2>
            <pre>{documentContent}</pre>
          </div>
        )}
      </main>
    </div>
  );
};

export default App
*/

import React, { useState } from 'react';

const App = () => {
  const [resume, setResume] = useState('');
  const [jobDesc, setJobDesc] = useState('');

  const handleResumeChange = (event) => {
    setResume(event.target.value);
  };

  const handleJobDescChange = (event) => {
    setJobDesc(event.target.value);
  };

  return (
    <div
      style={{
        backgroundColor: 'black',
        fontFamily: 'sans-serif',
        margin: '2rem',
        padding: '2rem',
        color: 'white',
        textAlign: 'center',
      }}
    >
      <h1>Resume Builder</h1>
      <h2>Hello User</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '50%', marginRight: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Paste your resume here.
          </label>
          <textarea
            value={resume}
            onChange={handleResumeChange}
            style={{ width: '100%', minHeight: '200px' }}
          />
        </div>
        <div style={{ width: '50%', marginLeft: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Place your job description here.
          </label>
          <textarea
            value={jobDesc}
            onChange={handleJobDescChange}
            style={{ width: '100%', minHeight: '200px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
