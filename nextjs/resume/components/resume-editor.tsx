'use client'
import React, { useState, useEffect } from 'react';

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
    resumeData: ResumeData;
    updateSharedState: (newState: any) => void;
}


const ResumeEditor: React.FC<Props> = ({ resumeData, updateSharedState }) => {
    const [localResumeData, setLocalResumeData] = useState<ResumeData>(resumeData);
    updateSharedState(localResumeData);


    useEffect(() => {
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        });
    }, [localResumeData]);
    const updateDescription = (
            section: keyof ResumeData,
            index: number,
            descriptionIndex: number,
            newValue: string
        ) => {
            const updatedSection = [...localResumeData[section]];
            updatedSection[index].description[descriptionIndex] = newValue;

            const updatedResumeData = {
                ...localResumeData,
                [section]: updatedSection,
            };

        setLocalResumeData(updatedResumeData);
        updateSharedState(updatedResumeData);
    };

    return (
        <div className="space-y-4"> {/* Added spacing between each section */}
            {(['Experience', 'Projects'] as Array<keyof ResumeData>).map((section) => (
                <div key={section} className="p-4 bg-gray-100 rounded-md"> {/* Styling for each section */}
                    <h2 className="font-bold text-black">{section}</h2> {/* Made the text bold */}
                    <div className="space-y-2"> {/* Added spacing between each item */}
                        {localResumeData[section].map((item, index) => (
                            <div key={index} className="p-3 bg-gray-200 rounded-md"> {/* Styling for each item */}
                                <h3 className="font-bold text-black">{item.company} - {item.title}</h3> {/* Made the text bold */}
                                {item.description.map((desc, descIndex) => (
                                    <div key={descIndex}>
                                        <textarea 
                                            value={desc} 
                                            onChange={(e) => 
                                                updateDescription(section, index, descIndex, e.target.value)}
                                            className="p-2 rounded-md text-black border border-gray-300 w-full"
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ResumeEditor;