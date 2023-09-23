'use client'

import React, { FC, useRef } from "react";

interface EditableContentProps {
  content: string;
  onChange: (newContent: string) => void;
}

const EditableContent: FC<EditableContentProps> = ({ content, onChange }) => {
  const handleContentChange = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLElement;
    onChange(target.innerHTML);
  };

  return (
    <div
      contentEditable
      suppressContentEditableWarning={true}
      onBlur={handleContentChange}
      className="w-full h-full p-8 overflow-y-auto"
    >
      {content}
    </div>
  );
};

interface DocumentPreviewProps {
  content: string;
  setContent: (newContent: string) => void;
}

const DocumentPreview: FC<DocumentPreviewProps> = ({ content, setContent }) => {
  return (
    <div
      className="w-64 h-96 bg-white border rounded shadow-lg"
      style={{ aspectRatio: "8.5 / 11" }}
    >
      <EditableContent content={content} onChange={setContent} />
    </div>
  );
};

const DocPreview: FC = () => {
  const [content, setContent] = React.useState<string>("");

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <DocumentPreview content={content} setContent={setContent} />
    </div>
  );
};

export default DocPreview;
