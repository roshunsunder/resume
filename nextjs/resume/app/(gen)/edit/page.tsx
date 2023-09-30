import React from 'react'
import ResumeEditor from '@/components/resume-editor'

import exampleData from './exampleData'
 
export default function Edit() {
  return (
    <section id="resumeEditor">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative pt-20 pb-24 md:pt-24 md:pb-32">
          <ResumeEditor resumeData={exampleData}/>
      </div>
    </section>
  )
}
