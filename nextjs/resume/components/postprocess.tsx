'use client'
import React, { useState } from 'react';
import ResumeEditor from './resume-editor';
import DocxDisplay from './docx-display';

import exampleData from './exampleData'


export default function Postprocess() {
    const [sharedState, setSharedState] = useState<any>(/* initial value */);

    const updateSharedState = (newState: any) => {
      setSharedState(newState);
    };
    return (
        <div className="flex">
          <div className="w-1/2 pr-4">
            <ResumeEditor 
              resumeData={exampleData} 
              updateSharedState={updateSharedState}  // Pass the update function as prop
            />
          </div>
          <div className="w-1/2 pl-4">
            <DocxDisplay sharedState={sharedState} />
          </div>
        </div>
      );
}
