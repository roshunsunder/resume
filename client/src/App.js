import React, {useState, useEffect} from 'react';
import { FileUploader } from "react-drag-drop-files";
import UploadForm from './uploadFile';

function App() {
  const [tokens, setTokens] = useState('');
  const [status, setStatus] = useState('')
  const [uploaded, setUploaded] = useState(false);
  const [userData, setUserData] = useState(null);
  const [res, setRes] = useState('');
  const fileTypes = ["PDF", "CSV", "DOCX", "ZIP"]

  const handleSubmit = async (event) => {
    event.preventDefault()
    setRes('')
    setStatus('Loading...')
    if (tokens === '') {
      return;
    }
    try {
      const response = await fetch('/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "tokens" : tokens, "client-id" : "dummy-id-2467" })
      }).then(
        res => res.json()
      ).then((
        data => setRes(data.Result)
      ));
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpload = (file) => {
    setUserData(file);
  };

  const handleDataUpload = async () => {
    if (userData == null) {
      return;
    }
    const formData = new FormData();
    console.log(userData);
    formData.append('file', userData);
    formData.append('filetype', userData.type);
    formData.append('fname', userData.name);
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result);
      setUploaded(true);
    } else {
      console.error('Failed to upload file');
    }
  }
  return (
    <>
    <div style={{
      fontFamily:"SF Pro",
      fontWeight:"bold",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      textAlign: 'center',
    }}>
      DocProc
    </div>
    {/* {!uploaded && <FileUploader handleChange={handleUpload} name="userData" types={fileTypes}/>}
    {!uploaded && <button onClick={handleDataUpload}>Upload</button>} */}
    <h1> Upload Form </h1>
    <UploadForm />
    <div>
      <form onSubmit={handleSubmit} style={{marginBottom : "20px", marginTop: "20px"}}>
        <input 
          type="text" 
          value={tokens} 
          onChange={(event) => setTokens(event.target.value)} 
          placeholder = "Write Query Here"
          style={{display: 'flex', fontFamily:"SF Pro", border:"none", width:"100vh", textAlign:"left", verticalAlign:"top", paddingBottom:"20vh", outline:"none", wordWrap:"break-word", whiteSpace:"pre-wrap"}}
        />
        <button type="submit">Submit</button>
      </form>
      
      {res ? <div style={{fontFamily:"SF Pro"}}>{res}</div> : <div style={{fontFamily:"SF Pro"}}>{status}</div>}
    </div>
    </>
  )
}

export default App