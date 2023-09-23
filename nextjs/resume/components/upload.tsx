import DocPreview from "./document-preview";
export default function UploadArea() {
    return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-row w-full max-w-5xl p-8 bg-white shadow-lg rounded-lg">
        {/* Left Section */}
        <div className="flex flex-col items-start w-1/3 pr-8">
          {/* Step 1: Upload Button */}
          <div data-aos="fade-up" className="text-xl text-slate-700 font-semibold mb-2">Step 1: Upload Your Resume</div>
          <label className="w-full flex justify-center items-center px-4 py-2 bg-purple-600 text-white rounded-lg shadow tracking-wide uppercase hover:bg-purple-700 hover:text-white">
            <input data-aos="fade-up" type="file" className="hidden" />
            Upload
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
          <button data-aos="fade-up" className="px-4 py-2 rounded bg-sky-400 text-white shadow hover:bg-sky-500">
            Submit
          </button>
        </div>

        {/* Right Section */}
        <div data-aos="fade-up" className="flex flex-col w-2/3 p-4 border-l">
          {/* Document Display */}
          <div className="bg-gray-200 w-full h-64 rounded p-4 shadow-inner">
            Document Display
          </div>
        </div>
      </div>
    </div>
    );
}