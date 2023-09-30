// Server-side API route for resume parsing
import OpenAI from "openai";
import { headers } from 'next/headers';

// Initialize environment variables
import * as dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY}); // Initialize OpenAI API

const extractJSONFromResumePrompt = `"Summarize the text below into a JSON object with exactly the following structure: \
{basic_info: {first_name, last_name, full_name, email, phone_number, location, portfolio_website_url, linkedin_url, \
github_main_page_url, university, education_level (BA, BS, MS, or PhD), graduation_year, graduation_month, majors, GPA}, \
work_experience: [{job_title, company, location, duration, job_summary}], project_experience:[{project_name, project_description}]}

If the information for a field is not available, leave that field empty.

### Text:

`

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
  const data = await request.json();

  // Verify request contains text and job_posting_text fields
  if (!data["resume_raw_text"] || !data["job_posting_text"]) {
    return new Response("Error: Request body contains incorrect fields.", {
        status: 400
    });
  }

  // Extract JSON representation of user resume
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        "role": "system",
        "content": "You are a helpful assistant and expert resume parser and builder."
      },
      {
        "role": "user",
        "content": extractJSONFromResumePrompt + data["resume_raw_text"]
      }
    ],
    temperature: 0,
    max_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  
  // Verify that the response is valid JSON
  if (!isValidJSON(response.choices[0].message.content || "")) {
    return new Response("Error: Invalid JSON returned from OpenAI API.", {
        status: 500
    });
  }
  
  const responseJSON = JSON.stringify(response);

  return new Response(responseJSON, {
      status: 200
  });
}
