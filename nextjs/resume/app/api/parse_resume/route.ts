// Server-side API route for resume parsing
import OpenAI from "openai";
import { headers } from 'next/headers';

import { get_encoding, encoding_for_model } from "@dqbd/tiktoken";


// Initialize environment variables
import * as dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY}); // Initialize OpenAI API
const openAIModelTokenLimits: {[key: string]: number} = {
  "gpt-4": 8192,
  "gpt-4-0613": 8192,
  "gpt-4-32k": 32768,
  "gpt-4-32k-0613": 32768,
  "gpt-3.5-turbo": 4097,
  "gpt-3.5-turbo-0613": 4097,
  "gpt-3.5-turbo-16k": 16385,
  "gpt-3.5-turbo-16k-0613": 16385,
  "gpt-3.5-turbo-instruct": 4097,
  "gpt-3.5-turbo-instruct-0914": 4097
}

type OpenAIRequestParams = {
  model: string;
  prompt: string;
  systemMsg?: string | null | undefined;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stopToken?: string | string[] | null;
};

/**
 * Sends a request to OpenAI's API to generate text based on the provided parameters.
 * @param model The ID of the model to use for text generation.
 * @param prompt The prompt to use as the starting point for text generation.
 * @param temperature Controls the "creativity" of the generated text. Higher values result in more creative text.
 * @param maxTokens The maximum number of tokens (words) to generate in the response.
 * @param topP Controls the diversity of the generated text. Lower values result in more diverse text.
 * @param frequencyPenalty Controls the frequency of repeated phrases in the generated text. Higher values result in less repetition.
 * @param presencePenalty Controls the presence of certain words or phrases in the generated text. Higher values result in more of these words or phrases.
 * @param stopToken A token at which text generation should stop.
 * @returns A Promise that resolves to the generated text.
 */
async function getOpenAICompletion({
  model,
  prompt,
  systemMsg = "",
  temperature = 0,
  maxTokens = 2048,
  topP = 1,
  frequencyPenalty = 0,
  presencePenalty = 0,
  stopToken = null,
}: OpenAIRequestParams) {
  const enc = get_encoding("cl100k_base");
  if (enc.encode(prompt).length > openAIModelTokenLimits[model]) {
    const error = new Error("Prompt exceeds model token limit.");
    error.name = 'ModelTokenLimitError';
    
    throw error;
  }
  enc.free();

  console.log(temperature, maxTokens, topP);

  const response = await openai.completions.create({
    model: model,
    prompt: prompt,
    temperature: temperature,
    max_tokens: maxTokens,
    top_p: topP,
    frequency_penalty: frequencyPenalty,
    presence_penalty: presencePenalty,
    stop: stopToken,
  });

  return response;
}

/**
 * Calls OpenAI's chat completions API to generate a response to a given prompt.
 * @param {Object} params - The parameters for the OpenAI request.
 * @param {string} params.model - The ID of the model to use for the request.
 * @param {string} params.prompt - The prompt to generate a response to.
 * @param {string} [params.systemMsg=""] - The system message to include in the request.
 * @param {number} [params.temperature=0] - The sampling temperature to use for the request.
 * @param {number} [params.maxTokens=2048] - The maximum number of tokens to generate in the response.
 * @param {number} [params.topP=1] - The top-p value to use for nucleus sampling.
 * @param {number} [params.frequencyPenalty=0] - The frequency penalty to use for the request.
 * @param {number} [params.presencePenalty=0] - The presence penalty to use for the request.
 * @param {string} [params.stopToken=null] - The token to stop generation at.
 * @returns {Promise<Object>} - A Promise that resolves to the response from the OpenAI API.
 */
async function getOpenAIChatCompletion({
  model,
  prompt,
  systemMsg = "",
  temperature = 0,
  maxTokens = 2048,
  topP = 1,
  frequencyPenalty = 0,
  presencePenalty = 0,
  stopToken = null,
}: OpenAIRequestParams) {
  const enc = get_encoding("cl100k_base");
  if (enc.encode(prompt).length > openAIModelTokenLimits[model]) {
    const error = new Error("Prompt exceeds model token limit.");
    error.name = 'ModelTokenLimitError';

    throw error;
  }
  enc.free();

  const response = await openai.chat.completions.create({
    model: model,
    messages: [
      {
        "role": "system",
        "content": systemMsg
      },
      {
        "role": "user",
        "content": prompt
      }
    ],
    temperature: temperature,
    max_tokens: maxTokens,
    top_p: topP,
    frequency_penalty: frequencyPenalty,
    presence_penalty: presencePenalty,
    stop: stopToken,
  });

  return response;
}

function extractJSONFromResumePrompt(resumeRawText: string) {
  return `You are an expert resume parser. 

You will be provided with text representing a candidate's resume, delimited by triple quotes. Summarize the text into a JSON with exactly the following structure:

{basic_info: {first_name, last_name, full_name, email, phone_number, location, portfolio_website_url, linkedin_url, github_url}, \
education: [{university, education_level (BA, BS, MS, or PhD), graduation_year, graduation_month, majors, GPA, relevant_coursework: []}], work_experience: \
[{title, company, location, start_date, end_date, summary}], research_experience: [{title, institution, location, start_date, end_date, summary}], project_experience:[{name, summary, link}], \
technical_skills: [], soft_skills: [], awards: []}

You will follow these rules when parsing the resume::
- If you cannot find a value for a particular JSON key, leave that key-value as an empty whitespace.
= For each summary section of a work experience, combine all the bullet points into one single sentence and REMOVE bullet points if present.

You will output only this JSON object.

### Candidate Resume:
"""${resumeRawText}"""

### Candidate Resume in JSON Format:
`;
}

function extractKeywordsFromJobPostingPrompt(jobPostingText: string) {
  return `You are an expert resume builder and consultant helping people get jobs at high-ranking companies.

You will be provided with text representing a job posting, delimited by triple quotes.

Identify and list all the relevant technical ATS keywords and phrases that candidates should include in their resumes to match the job role's requirements. Generate an exhaustive list with technical and soft skills that the job posting requires.

Output your response as JSON with the following keys:
- job_title
- hard_skills
- soft_skills
- relevant_coursework

### Job Description:
"""${jobPostingText}"""

### Keywords in JSON Format:
`;
}

// 4. Feel free to embellish each summary of the candidate's experiences. That is, include soft skills if they are not originally written in the candidate experiences. \
// However, DO NOT include hard skills if they were not in the candidate experiences originally.

function tailorResumeFromJobPostingPrompt(resumeJSON: string, jobPostingText: string) {
  return `You are a resume building expert.  

You will be given a job description, delimited by triple quotes. You will understand the roles and responsibilities of the job. \
You will also understand the qualifications of the job.  Then you will be given the experiences of a candidate for the job in JSON format.

Your task is to tailor and rewrite the candidate's resume to align with the job description, highlighting experiences relevant to the job. \
Rewrite the candidate's experiences to better match the job description's language.

Follow these steps to edit the resume:
1. Go through all the candidate's work, research, and project experiences.
2. Identify all the relevant technical ATS keywords and phrases that candidates should include in their resumes to match the job role's requirements.
3. Elaborate on each summary by smoothly integrating the relevant ATS keywords and phrases - reword each summary to align with the job description.
4. Condense each reworded summary into a list of bullet points that are evenly dispersed.
5. Include the condensed list of bullet points as the "summary" key for each experience.

You will follow these rules when editing:
- DO NOT add work experiences if not present in the candidate's original experiences.
- DO NOT change any information about the candidate's education or education level.
- Ensure the summary descriptions are written in THIRD PERSON. 

### Job Description:
"""${jobPostingText}"""

### Candidate Resume in JSON:
${resumeJSON}

### Rewritten Resume in JSON:
`;
}

function tailorResumeFromKeywordsPrompt(resumeJSON: string, keywords: string) {
  return `You are an expert resume editor specializing in optimizing resumes for ATS systems. Your task is to edit existing resumes to strategically incorporate ATS keywords, maximizing the match percentage with job descriptions and ATS keywords/phrases.

You will be given ATS keywords in JSON format (divided into hard skills, soft skills, and other keywords) and a resume in JSON with work experience information.

Edit the existing resume to incorporate the provided ATS keywords into the relevant sections. Make sure it's highly optimized for ATS systems and as concise as possible. 

While rewriting, you must obey this rule:

Do not include hard or technical skills if they were not in the candidate experiences originally. This includes technologies, platforms, software, and other related technical skills.

Output the edited resume as a JSON object with the same keys.

### ATS Keywords in JSON:
${keywords}

### Candidate Resume in JSON:
${resumeJSON}

### Rewritten Resume in JSON:
`;
}


/**
 * Extracts JSON data from a given resume raw text using OpenAI's GPT-3 model.
 * @param resumeRawText The raw text of the resume.
 * @returns A Promise that resolves to the extracted JSON data.
 */
async function extractJSONFromResume(resumeRawText: string, temp: number = 0.2) {
  console.log("Extracting JSON from resume...");

  const enc = encoding_for_model("gpt-3.5-turbo");

  const prompt = extractJSONFromResumePrompt(resumeRawText);
  const maxTokens = openAIModelTokenLimits["gpt-3.5-turbo-instruct"] - enc.encode(prompt).length;
  enc.free();

  console.log(prompt);

  const response = await getOpenAICompletion({
    model: "gpt-3.5-turbo-instruct",
    prompt: prompt,
    temperature: temp,
    maxTokens: maxTokens,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    stopToken: null,
  });

  return response.choices[0].text;
}


/**
 * Extracts keywords from a job posting text using OpenAI's GPT-3.5 Turbo Instruct model.
 * @param jobPostingText The job posting text to extract keywords from.
 * @returns A string containing the extracted keywords.
 */
async function extractKeywordsFromJobPosting(jobPostingText: string, temp: number = 0.5) {
  const enc = encoding_for_model("gpt-3.5-turbo");

  const prompt = extractKeywordsFromJobPostingPrompt(jobPostingText);
  const maxTokens = openAIModelTokenLimits["gpt-3.5-turbo-instruct"] - enc.encode(prompt).length;
  enc.free();

  const response = await getOpenAICompletion({
    model: "gpt-3.5-turbo-instruct",
    prompt: extractKeywordsFromJobPostingPrompt(jobPostingText),
    temperature: temp,
    maxTokens: maxTokens,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    stopToken: null,
  });

  return response.choices[0].text;
}

/**
 * Tailors the given resume JSON based on the provided job posting text using OpenAI's GPT-3.5-turbo-instruct model.
 * @param resumeJSON The resume JSON to be tailored.
 * @param jobPostingText The job posting text to tailor the resume for.
 * @returns The tailored resume text.
 */
async function tailorResumeFromJobPosting(resumeJSON: string, jobPostingText: string, temp: number = 0.8) {
  console.log("Tailoring resume to job posting...");

  const enc = encoding_for_model("gpt-3.5-turbo");

  const prompt = tailorResumeFromJobPostingPrompt(resumeJSON, jobPostingText);
  const maxTokens = openAIModelTokenLimits["gpt-3.5-turbo-instruct"] - enc.encode(prompt).length - 100;
  enc.free();

  console.log(prompt);

  const response = await getOpenAICompletion({
    model: "gpt-3.5-turbo-instruct",
    prompt: prompt,
    temperature: temp,
    maxTokens: maxTokens,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    stopToken: null,
  });

  return response.choices[0].text;
  // const response = await getOpenAIChatCompletion({
  //   model: "gpt-3.5-turbo",
  //   prompt: prompt,
  //   systemMsg: "",
  //   temperature: temp,
  //   maxTokens: maxTokens,
  //   topP: 1,
  //   frequencyPenalty: 0,
  //   presencePenalty: 0,
  //   stopToken: null,
  // });

  // return response.choices[0].message.content;
}

/**
 * Tailors a resume JSON string based on a set of keywords using OpenAI's GPT-3 model.
 * @param resumeJSON - The resume JSON string to be tailored.
 * @param keywords - The keywords to be used for tailoring the resume.
 * @returns A Promise that resolves to the tailored resume string.
 */
async function tailorResumeFromKeywords(resumeJSON: string, keywords: string, temp: number = 0.8) {
  const enc = encoding_for_model("gpt-3.5-turbo");

  const prompt = tailorResumeFromKeywordsPrompt(resumeJSON, keywords);
  const maxTokens = openAIModelTokenLimits["gpt-3.5-turbo-instruct"] - enc.encode(prompt).length;
  enc.free();

  const response = await getOpenAICompletion({
    model: "gpt-3.5-turbo-instruct",
    prompt: prompt,
    temperature: temp,
    maxTokens: maxTokens,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    stopToken: null,
  });

  return response.choices[0].text;
}

/**
 * Create custom error class called ResumeParserError with error types: ResumeTokenLimitError, JobPostingTokenLimitError.
 */ 
type ErrorName = | "ResumeTokenLimitError" | "JobPostingTokenLimitError" 
                  | "InvalidJSONError" | "ModelTokenLimitError";
class ResumeParserError extends Error {
  name: ErrorName;
  message: string;
  cause: any;

  constructor({
    name, 
    message,
    cause
  }: {
    name: ErrorName;
    message: string;
    cause?: any;
  }) {
    super();
    this.name = name;
    this.message = message;
    this.cause = cause;
  }
}

async function tailorResumePipeline(resumeRawText: string, jobPostingText: string) {
  const encoding = encoding_for_model("gpt-3.5-turbo");

  // Raise Typescript exception if resume is over 4000 tokens long
  if (encoding.encode(extractJSONFromResumePrompt(resumeRawText)).length > 4000) {
    throw new ResumeParserError({
      name: "ResumeTokenLimitError",
      message: "Resume is over 4000 tokens long."
    });
  }

  if (encoding.encode(jobPostingText).length > 4000) {
    throw new ResumeParserError({
      name: "JobPostingTokenLimitError",
      message: "Job posting is over 4000 tokens long."
    });
  }

  // Extract JSON from resume
  const resumeJSON = await extractJSONFromResume(resumeRawText);
  console.log(resumeJSON);

  if (!isValidJSON(resumeJSON)) {
    throw new ResumeParserError({
      name: "InvalidJSONError",
      message: "Resume JSON is invalid."
    });
  }

  // Tailor resume from job posting or based on keywords:
  // If the tailorResumeFromJobPosting prompt is short enough, tailor resume directly from job posting
  // Else tailor resume from keywords
  // const keywords = await extractKeywordsFromJobPosting(jobPostingText);
  // const tailoredResume = await tailorResumeFromKeywords(resumeJSON, keywords);
  const tailoredResume = await tailorResumeFromJobPosting(resumeJSON, jobPostingText, 1);
  console.log(tailoredResume);

  encoding.free();
  return tailoredResume;
}

/**
 * Checks if a given string is a valid JSON.
 * @param text - The string to be checked.
 * @returns A boolean indicating whether the string is a valid JSON or not.
 */
function isValidJSON(text: string): boolean {
  try {
    JSON.parse(text);
  } catch (e) {
    return false;
  }

  return true;
}

/**
 * Handles POST requests to parse a resume and job posting text using OpenAI API.
 * @param request - The incoming request object.
 * @returns A response object with the parsed resume and job posting text as JSON.
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Verify request contains text and job_posting_text fields
    if (!data["resume_raw_text"] || !data["job_posting_text"]) {
      return new Response("Error: Request body contains incorrect fields.", {
          status: 400
      });
    }

    // If the following function throws an error, the code will jump to the catch block.
    const result = await tailorResumePipeline(data["resume_raw_text"], data["job_posting_text"]);

    console.log("Success!");
    
    // You can insert your success response here.
    return new Response(result, {
        status: 200
    });

  } catch (e) {
    let headers = {
      'X-Error-Name': e.name,
      'X-Error-Message': e.message
    };

    return new Response(`An unexpected error occurred (${e.name}): ${e.message}`, {
                          status: 400,
                          headers
                        });
  }
}

