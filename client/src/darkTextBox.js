import React, { useState } from 'react';

const DarkTextBox = ({job, handleChange, submitFunction}) => {
  const [text, setText] = useState('');

  return (
    <div>
      <textarea
        style={{
          width: '100%',
          height: '200px',
          border: 'none',
          resize: 'none',
          backgroundColor: '#333',
          color: '#fff',
          padding: '10px',
          marginBottom: '10px',
          marginRight: '10px',
          fontSize: '18px',
          fontFamily: 'SF Pro',
        }}
        value={job}
        onChange={handleChange}
        placeholder="Simply paste your job description here"
        wrap="soft"
      />
      <button
        style={{
          backgroundColor: '#666',
          color: '#fff',
          padding: '10px 20px',
          border: 'none',
          fontSize: '16px',
          cursor: 'pointer',
          borderRadius: '4px',
          display: 'block',
          margin: '0 auto',
        }}
        onClick={submitFunction}
      >
        Submit
      </button>
    </div>
  );
};

export default DarkTextBox;
