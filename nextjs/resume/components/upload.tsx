"use client";

import DocPreview from "./document-preview";
import {useState} from "react";

export default function UploadArea() {
    const [pdfURL, setPdfURL] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(false);
    const [showPdf, setShowPdf] = useState(false);

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      const objectURL = URL.createObjectURL(file);

      setUploadedFile(true);
      setPdfURL(objectURL);
      setShowPdf(true);
      // setIsLoading(true);
      // setTimeout(() => {
      //   setPdfURL(objectURL);
      //   setIsLoading(false);
      // }, 2000);
    };

    return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-row w-full max-w-5xl p-8 bg-white shadow-lg rounded-lg">
        {/* Left Section */}
        <div className="flex flex-col items-start w-1/3 pr-8">
          {/* Step 1: Upload Button */}
          <div data-aos="fade-up" className="text-xl text-slate-700 font-semibold mb-2">Step 1: Upload Your Resume</div>
          <div data-aos="fade-up" className="text-sm text-slate-500 mb-4">
            Supported file types: .pdf, .doc, .docx
          </div>
          <label className="w-full flex justify-center items-center px-4 py-2 bg-purple-600 text-white rounded-lg shadow tracking-wide uppercase hover:bg-purple-700 hover:text-white cursor-pointer">
            <input data-aos="fade-up" type="file" className="hidden" accept="application/pdf" onChange={handleFileChange} />
            Upload Resume
          </label>

          {/* Step 2: Expanding Text Box */}
          <div data-aos="fade-up" className="text-xl text-slate-700 font-semibold mt-8 mb-2">Step 2: Paste the Job Description</div>
          <textarea
            data-aos="fade-up"
            className="w-full p-4 border rounded-md shadow-inner"
            rows={4}
            placeholder="Paste the job description here..."
          ></textarea>

          {/* Step 3: Submit Button */}
          <div data-aos="fade-up" className="text-xl text-slate-700 font-semibold mt-8 mb-2">Step 3: Let Us Do The Work</div>
          <button data-aos="fade-up" className="w-full flex px-4 py-2 justify-center items-center rounded bg-sky-400 text-white shadow hover:bg-sky-500">
            Reformat Resume
          </button>
        </div>

        {/* Right Section */}
        <div data-aos="fade-up" className="flex flex-col w-2/3 p-4 border-l">
          {/* Document Display */}
          <div bg-gray-200 w-full h-64 rounded p-4 shadow-inner>
            {/* <input type="file" accept="application/pdf" onChange={handleFileChange} /> */}
            {!uploadedFile ? (
              <img src="https://user-images.githubusercontent.com/53836911/97809147-3f229a00-1c91-11eb-8fb8-730e772e3151.gif" alt="loading" />
            ) : (
              showPdf && (
                <div className="animate-fade-in" style={{animationDuration: "1s", animationTimingFunction: "ease-in-out"}}>
                  <object data={pdfURL} type="application/pdf" width="600" height="400">
                    <embed src={pdfURL} type="application/pdf" />
                  </object>
                </div>
              )
            )}
          </div>
          {/* <div className="bg-gray-200 w-full h-64 rounded p-4 shadow-inner">
            Document Display
          </div> */}
        </div>
      </div>
    </div>
    );
}