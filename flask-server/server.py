from flask import Flask, request
from pathlib import Path
from werkzeug.utils import secure_filename
import os
import shutil
import pandas as pd
import json
import openai

from docx import Document
from dotenv import load_dotenv


app = Flask(__name__)
curr_filename = ""

MODEL = "gpt-3.5-turbo"

load_dotenv()
api_key = os.getenv('OPENAI_API_KEY')

def get_completion(prompt, model="gpt-4", temp=0):
    messages = [{"role": "user", "content": prompt}]
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=temp, # this is the degree of randomness of the model's output
    )
    return response.choices[0].message["content"]


@app.route("/query", methods=['POST'])
def query():
    # This handles the job description
    job_desc = request.json['tokens']

    # This gets the data from the resume as a string
    doc = Document(curr_filename)
    resume = ""
    for para in doc.paragraphs:
        resume += para.text + '\n'
    print(job_desc)

    json_prompt = f"""
    Given this XML-formatted resume that is delimited by triple backticks, \
        generate a list for every item in the experience section. These items should be in JSON format, and \
            the keys should be their corresponding XML tag.
            
            'description' should be a list of the description items, not a nested JSON object.
            ```{resume}```
    """

    json_response = get_completion(json_prompt, model="gpt-3.5-turbo")

    final_prompt = f"""
    You are a resume building expert.  I am going to first give you a job description.  \
    You will understand the roles and responsibilities of the job.  You will also understand the qualifications of the job.  \
    Then I will give you work experiences of a candidate in JSON format.  

    Your job is to rewrite the job experience to match the job \
    description, highlighting experiences relevant to the job.  First I will start with the job description, \
    which is delimited by triple backticks.

    JOB DESCRIPTION: ```{job_desc}```

    Now, rewrite and return the following roles and responsibilities of the candidate to better \
    match the job description's language.  Highlight the experiences that better align with the job description.  \
    When there is no alignment, just return the candidate experience description item as-is.

    While rewriting, you must obey this rule: 

    Feel free to embellish. That is, include soft skills \
    etc. if they are not originally written in the candidate experiences. However, do not inlcude hard skills \
    if they were not in the candidate experiences originally. That is, don't \
    lie about hard skills, but feel free to embellish soft skills.

    The character count for all the experiences should not total more than 1450 characters.
    CANDIDATE EXPERIENCE JSON: ```{json_response}```
    """

    res = get_completion(final_prompt)
    return {"Result" : res}

# @app.route("/upload", methods=['POST'])
# def upload():
#     destination_folder = f'client_data/{client_id}_client_files'
#     os.makedirs(destination_folder, exist_ok=True)
#     f = request.files['file']
#     ftype = request.form['filetype']
#     fname = request.form['fname']
#     def upload_zip():
#         f.save(f"client_data/{client_id}_data_archive.zip")

#         with zipfile.ZipFile(f, 'r') as zip_ref:
#             for member in zip_ref.infolist():
#                 # construct the destination path for each file
#                 extracted_path = os.path.join(destination_folder, member.filename)

#                 # extract the file to the destination path
#                 zip_ref.extract(member, destination_folder)
#     def upload_file():
#         f.save(f"{destination_folder}/{client_id}_{fname}")
    
#     if ftype not in filetype_encodings:
#         return "Unrecognized file format"
    
#     extension = filetype_encodings[ftype]
#     if extension == "zip":
#         upload_zip()
#     else:
#         upload_file()

#     return {"res" : "Uploaded to Flask!"}
@app.route("/upload", methods=['POST'])
def upload():
    global curr_filename
    f = request.files['file']
    if f:
        filename = secure_filename(f.filename)
        f.save(filename)
        curr_filename = filename
        return 'File uploaded successfully'
    else:
        return 'File upload failed'

if __name__ == "__main__":
    app.run(debug=True)