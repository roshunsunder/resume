from flask import Flask, request
# from werkzeug import secure_filename
# from werkzeug.datastructures import  FileStorage
from llama_index import GPTSimpleVectorIndex, LLMPredictor, download_loader, SimpleDirectoryReader
from pathlib import Path
import zipfile
from langchain.chat_models import ChatOpenAI
from dotenv import load_dotenv
import os
import shutil
import pandas as pd


app = Flask(__name__)
client_id = "dummy-id-2467"
chat_history = {} # Keeps client chat histories
filetype_encodings = {
    "application/pdf" : "pdf",
    "application/zip" : "zip",
    "application/msword" : "doc",
    "text/csv" : "csv",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document" : "docx"
}
MODEL = "gpt-3.5-turbo"

def runcleanup(top_level):
    for root, dirs, files in os.walk(top_level):
        for file in files:
            shutil.move(f"{root}/{file}", f"{top_level}/{file}")

    for root, dirs, files in os.walk(top_level, topdown=False):
        for directory in dirs:
            os.rmdir(f"{root}/{directory}")

def chat(query, key, client_id):
    if not client_id:
        return("Invalid credentials, please ensure client id is correct")
    os.environ['OPENAI_API_KEY'] = key

    if client_id not in chat_history:
        chat_history[client_id] = ""

    data_directory = Path(f"./client_data/{client_id}_client_files")
    if not data_directory.is_dir():
        return("Please upload a file or folder before running queries!")
    
    documents = SimpleDirectoryReader(f'client_data/{client_id}_client_files').load_data()

    llm_predictor = LLMPredictor(llm=ChatOpenAI(temperature=0, model_name=MODEL))
    # index_file = Path(f"./client_indices/{client_id}_bot_index.json")
    # index = None
    # if index_file.is_file():
    #     index = GPTSimpleVectorIndex.load_from_disk(f"./client_indices/{client_id}_bot_index.json")
    # else:
    #     print("Client index not found, constructing")
    #     index = GPTSimpleVectorIndex(documents, llm_predictor=llm_predictor)
    #     index.save_to_disk(f"./client_indices/{client_id}_bot_index.json")
    index = GPTSimpleVectorIndex(documents, llm_predictor=llm_predictor)
    index.save_to_disk(f"./client_indices/{client_id}_bot_index.json")
    # Query
    # chat_history[client_id] += f'USER MESSAGE: {query}'
    response = index.query(query)
    #response = index.query(chat_history[client_id])
    # chat_history[client_id] += f"\n AI RESPONSE AFTER QUERYING INDEX: {response}"
    return str(response)

@app.route("/query", methods=['POST'])
def query():
    tokens = request.json['tokens']
    client_id = request.json['client-id']
    output = chat(query=tokens, key="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", client_id=client_id)
    return {"Result" : output}

@app.route("/upload", methods=['POST'])
def upload():
    destination_folder = f'client_data/{client_id}_client_files'
    os.makedirs(destination_folder, exist_ok=True)
    f = request.files['file']
    ftype = request.form['filetype']
    fname = request.form['fname']
    def upload_zip():
        f.save(f"client_data/{client_id}_data_archive.zip")

        with zipfile.ZipFile(f, 'r') as zip_ref:
            for member in zip_ref.infolist():
                # construct the destination path for each file
                extracted_path = os.path.join(destination_folder, member.filename)

                # extract the file to the destination path
                zip_ref.extract(member, destination_folder)
    def upload_file():
        f.save(f"{destination_folder}/{client_id}_{fname}")
    
    if ftype not in filetype_encodings:
        return "Unrecognized file format"
    
    extension = filetype_encodings[ftype]
    if extension == "zip":
        upload_zip()
    else:
        upload_file()
    
    runcleanup(destination_folder)

    return {"res" : "Uploaded to Flask!"}

if __name__ == "__main__":
    app.run(debug=True)