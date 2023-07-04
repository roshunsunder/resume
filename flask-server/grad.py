import gradio as gr
import os

from dotenv import load_dotenv

load_dotenv()

from utils import naked_query

demo = gr.Interface(fn=naked_query, inputs=['text', 'text'], outputs='file')

demo.launch()