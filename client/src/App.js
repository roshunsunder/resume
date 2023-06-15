import React, {useState, useEffect} from 'react';
import { FileUploader } from "react-drag-drop-files";
import UploadForm from './uploadFile';
import { useDropzone } from 'react-dropzone';
import './App.css';

// function App() {
//   const [tokens, setTokens] = useState('');
//   const [status, setStatus] = useState('')
//   const [uploaded, setUploaded] = useState(false);
//   const [userData, setUserData] = useState(null);
//   const [res, setRes] = useState('');
//   const fileTypes = ["PDF", "CSV", "DOCX", "ZIP"]

//   const handleSubmit = async (event) => {
  //   event.preventDefault()
  //   setRes('')
  //   setStatus('Loading...')
  //   if (tokens === '') {
  //     return;
  //   }
  //   try {
  //     const response = await fetch('/query', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ "tokens" : tokens, "client-id" : "dummy-id-2467" })
  //     }).then(
  //       res => res.json()
  //     ).then((
  //       data => setRes(data.Result)
  //     ));
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

//   return (
//     <>
//     <div style={{
//       fontFamily:"SF Pro",
//       fontWeight:"bold",
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       padding: '20px',
//       textAlign: 'center',
//     }}>
//       DocProc
//     </div>
//     {/* {!uploaded && <FileUploader handleChange={handleUpload} name="userData" types={fileTypes}/>}
//     {!uploaded && <button onClick={handleDataUpload}>Upload</button>} */}
//     <h1> Upload Form </h1>
//     <UploadForm />
//     <div>
      // <form onSubmit={handleSubmit} style={{marginBottom : "20px", marginTop: "20px"}}>
      //   <input 
      //     type="text" 
      //     value={tokens} 
      //     onChange={(event) => setTokens(event.target.value)} 
      //     placeholder = "Write Query Here"
      //     style={{display: 'flex', fontFamily:"SF Pro", border:"none", width:"100vh", textAlign:"left", verticalAlign:"top", paddingBottom:"20vh", outline:"none", wordWrap:"break-word", whiteSpace:"pre-wrap"}}
      //   />
      //   <button type="submit">Submit</button>
      // </form>
      
//       {res ? <div style={{fontFamily:"SF Pro"}}>{res}</div> : <div style={{fontFamily:"SF Pro"}}>{status}</div>}
//     </div>
//     </>
//   )
// }
const App = () => {
  const [documentContent, setDocumentContent] = useState('haha');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [job, setJob] = useState('');

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


  const handleUpload = async (uploadedDocument) => {
    return;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Resume Refiner</h1>
      </header>
      <main>
        <FileUpload />
        <form onSubmit={handleUpload} style={{marginBottom : "20px", marginTop: "20px"}}>
          <input 
            type="text" 
            value={job} 
            onChange={(event) => setJob(event.target.value)} 
            placeholder = "Simply paste job description here"
            style={{display: 'flex', fontFamily:"SF Pro", border:"none", width:"100vh", textAlign:"left", verticalAlign:"top", paddingBottom:"20vh", outline:"none", wordWrap:"break-word", whiteSpace:"pre-wrap"}}
          />
          <button type="submit">Submit</button>
        </form>
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