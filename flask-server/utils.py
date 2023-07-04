from dotenv import load_dotenv
from docx import Document
import openai
import os
import json
from pdf import PDFWrapper

def get_completion(prompt, model="gpt-4", temp=0):
    load_dotenv()
    api_key = os.getenv('OPENAI_API_KEY')
    openai.api_key = api_key
    messages = [{"role": "user", "content": prompt}]
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=temp, # this is the degree of randomness of the model's output
    )
    return response.choices[0].message["content"]

def naked_query(job_desc: str, input_json: str):
    prompt = f"""
    You are a resume building expert.  I am going to first give you a job description.  \
    You will understand the roles and responsibilities of the job.  You will also understand the qualifications of the job.  \
    Then I will give you work experiences of a candidate in JSON format.

    Your job is to rewrite the job experience to match the job \
    description, highlighting experiences relevant to the job.  First I will start with the job description, \
    which is delimited by triple backticks.

    JOB DESCRIPTION: ```{job_desc}```

    Now, rewrite and return the following roles and responsibilities of the candidate to better \
    match the keywords of the job description.

    Return only well-formatted JSON. The character count for all the experiences should not total more than 1450 characters.
    CANDIDATE EXPERIENCE JSON: {input_json}"""

    res = get_completion(prompt)

    cleaning_prompt = f"""
    You are a quality analyst for an program that automatically edits resumes.
    Unfortunately, that program isn't perfect.
    I will give you the original resume and an edited resume that the program gave to \
    you. Your job is to make as few changes to the EDITED resume as possible, and only \
    to remove technical skills from the edited resume that were not implied by the original resume.

    It is possible that the program worked perfectly, and no extra technical skills were \
    mistakenly included. In that case, simply return the EDITED resume as is.

    Return only the JSON object after you have corrected it.

    ORIGINAL: {input_json}
    EDITED: {res}
    """

    cleaned = get_completion(cleaning_prompt)
    pdf = PDFWrapper()
    pdf.add_title('Roshun Sunder', '508 W 114th St, New York, NY 10025', 'roshun.sunder@gmail.com', '503-686-3249', 'roshunsunder.com')
    pdf.add_education('Columbia University', 'New York, NY', 'May 2024', 'Computer Science', degree='BA', GPA='3.8')
    pdf.add_generic_section('EXPERIENCE', json.loads(cleaned))
    pdf.output('automated.pdf')
    return './automated.pdf'