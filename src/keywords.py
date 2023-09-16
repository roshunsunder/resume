"""
Utilities and classes for extracting keywords from a job posting.
"""

from collections import namedtuple
from typing import List

from llm import LLMWrapper

llm = LLMWrapper()
Keyword = namedtuple("Keyword", ["keyword", "type"])


class Keywords():
    def __init__(self):
        pass

    def extract_keywords_from_posting(self, prompt: str, job_posting_content: str) -> str:
        """
        Extracts keywords from a job posting.
        """
        
        extract_keywords_prompt = prompt.format(job_posting_content=job_posting_content)

        keywords = llm.get_completion(extract_keywords_prompt, model="gpt-3.5-turbo")
        return keywords
        