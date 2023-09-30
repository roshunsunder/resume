'use client'
import React from 'react'

interface Experience {
    company: string;
    title: string;
    start: string;
    end: string;
    location: string;
    description: string[];
}

interface Project {
    company: string;
    title: string;
    start: string;
    end: string;
    location: string;
    description: string[];
}

interface ResumeData {
    Experience: Experience[];
    Projects: Project[];
}

interface Bio {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
  }
  
interface Education {
    institution: string;
    degree: string;
    major: string;
    minor: string;
    start: string;
    end: string;
    location: string;
    relevantCoursework: string[];
}
  
interface CandidateInfo {
    Bio: Bio;
    Education: Education;
}

interface Props {
    sharedState: ResumeData;
}
const DocxDisplay: React.FC<Props> = ({ sharedState }) =>{
  return (
    <div>{sharedState ? sharedState.Experience[0].description[0] : <div>Hello</div>}</div>
  )
}

export default DocxDisplay;
