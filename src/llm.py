"""
Utilities for running LLM commands.
"""

import openai
import os
from dotenv import load_dotenv

load_dotenv()

class LLMWrapper():
    def __init__(self):
        pass

    def get_completion(self, prompt, model="gpt-4", temp=0):
        api_key = os.getenv('OPENAI_API_KEY')
        openai.api_key = api_key
        messages = [{"role": "user", "content": prompt}]
        response = openai.ChatCompletion.create(
            model=model,
            messages=messages,
            temperature=temp, # this is the degree of randomness of the model's output
        )
        return response.choices[0].message["content"]