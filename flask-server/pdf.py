from fpdf import FPDF
import json

class PDFWrapper():
    # Rules: 
    # Each function ought to leave a newline space at the end of their procedure
    # Ecah function ought to set the required styling at the beginning of their procedure
    def __init__(self):
        self.indent = 72
        self.newline = 14
        self.font_size = 10
        self.font = 'Times'
        self.pdf = FPDF(orientation='P', unit='pt', format='Letter')
        self.pdf.add_page()
        self.pdf.set_left_margin(self.indent)
        self.pdf.set_right_margin(self.indent)
    
    def output(self, name: str):
        self.pdf.output(name)
    
    def __return_thin_wide(self):
        chars = []
        for i in range(ord('A'), ord('z') + 1):
            chars.append(chr(i))
        widths = [self.pdf.get_string_width(i) for i in chars]
        return min(widths), max(widths)
    
    def __add_line(self):
        self.pdf.ln(h=7)
        curr_y = self.pdf.get_y()

        # Calculate x abscissa
        w, h = self.pdf.default_page_dimensions


        # Draw a line from 0 to length, at height y
        self.pdf.line(self.indent, curr_y, self.pdf.epw + self.indent, curr_y)
        self.pdf.ln(h=2)
    
    def add_title(
            self,
            name: str,
            address: str,
            email: str,
            phone: str,
            portfolio: str = None
    ):
        self.pdf.set_font('Times', 'B', size=20)
        self.pdf.cell(w=0, h=0, align='C', txt=name)
        self.pdf.ln(h=18)
        self.pdf.set_font('Times', style='', size=10)
        self.pdf.cell(w=0, h=0, align='C', txt=address)

        information = f"{email} | {phone} | {portfolio}" if portfolio else f"{email} | {phone}"
        self.pdf.ln(h=self.newline)
        self.pdf.cell(w=0, h=0, align='C', txt=information)
        self.pdf.ln(h=self.newline)

    def __bulleted_list(self, items : list, bullet='·'):
            for item in items:
                self.pdf.set_font('Times', 'B', size=10)
                self.pdf.cell(txt=f"{bullet}")
                self.pdf.set_font('Times', '', size=10)
                self.pdf.set_left_margin(self.indent + 12)
                self.pdf.multi_cell(self.pdf.epw, 12, f"{item}")
                self.pdf.set_left_margin(self.indent)
                self.pdf.ln(h=0)
            self.pdf.set_left_margin(self.indent)
    
    def __add_job_title(self, company: str, title: str, location: str, start: str, end: str):
        width, h = self.pdf.default_page_dimensions
        self.pdf.set_font('Times', 'B', size=10)
        self.pdf.cell(w = self.pdf.epw / 2, txt=company, align='L')
        self.pdf.set_font('Times', '', size=10)
        self.pdf.cell(w = self.pdf.epw / 2, txt=f"{start} - {end}", align='R')
        self.pdf.ln(self.newline)
        self.pdf.set_font('Times', 'I', size=10)
        self.pdf.cell(w= self.pdf.epw / 2, txt=title, align='L')
        self.pdf.set_font('Times', '', size=10)
        self.pdf.cell(w=self.pdf.epw / 2, txt=location, align='R')
        self.pdf.ln(self.newline)
    
    def add_generic_section(self, name: str, data):
        self.pdf.set_font('Times', 'B', size=10)
        self.pdf.cell(w=0, h=0, align='L', txt=name)
        self.__add_line()
        for entry in data:
            self.__add_job_title(entry['company'], entry['title'], entry['location'], entry['start'], entry['end'])
            self.__bulleted_list(entry['description'])
        self.pdf.ln(h=self.newline)
    
    def chars_left(self):
        self.pdf.set_font(self.font)
        curr_font_size = self.pdf.font_size
        self.pdf.set_font_size(self.font_size)
        lines_left = int((self.pdf.eph - self.pdf.y) / self.newline)
        self.pdf.ln(self.newline)
        thin_char_width, wide_char_width = self.__return_thin_wide()
        chars_per_line_lower = (self.pdf.epw / wide_char_width) - 1
        chars_per_line_upper = (self.pdf.epw / thin_char_width) - 1
        self.pdf.set_font_size(curr_font_size)
        # For now, using a heuristic
        return int((lines_left - 3) * (0.8 * chars_per_line_upper))
        

    
    def add_education(
            self,
            institution: str, 
            location: str, 
            graduation: str, 
            concentration : str,
            courses: list[str] = '', 
            awards_honors : list[str] = '', 
            degree: str = '', 
            GPA: str = '',  
        ):
        self.pdf.set_font('Times', 'B', size=10)
        self.pdf.cell(w=0, h=0, align='L', txt='EDUCATION')
        self.__add_line()
        self.pdf.set_font('Times', 'B', size=10)
        self.pdf.cell(w=self.pdf.epw / 2, txt=institution, align='L')
        self.pdf.set_font('Times', '', size=10)
        self.pdf.cell(w=self.pdf.epw / 2, txt = location, align='R')
        self.pdf.ln(self.newline)
        first_line = f"{degree}, {concentration}. {GPA}" if len(degree) else f"{concentration}. {GPA}"
        self.pdf.cell(w=self.pdf.epw / 2, txt= first_line, align='L')
        self.pdf.cell(w=self.pdf.epw / 2, txt = graduation, align='R')
        self.pdf.ln(self.newline)
    
    def add_skills(
            self,
            string
    ):
        self.pdf.set_font(self.font, 'B',size=10)
        self.pdf.cell(w=0, h=0, align='L', txt='SKILLS')
        self.__add_line()
        self.pdf.cell(txt=string)


        self.pdf.ln(self.newline + 10)

string = """
{\n  "Experience": [\n    {\n      "company": "Cedar Inc.",\n      "title": "Software Engineering Intern",\n      "start": "May 2022",\n      "end": "August 2022",\n      "location": "New York, NY",\n      "description": [\n        "Exhibited proficiency in Python and Django while developing for a FinTech unicorn in an Agile environment, focusing on distributed systems",\n        "Designed and implemented a notification system to streamline patient communication, aiding in bill payment",\n        "Successfully deployed code to a production environment, effectively reducing unnecessary call volume for hospitals by over 95%"\n      ]\n    },\n    {\n      "company": "Neck App",\n      "title": "Software Engineering Intern",\n      "start": "May 2021",\n      "end": "September 2021",\n      "location": "New York, NY",\n      "description": [\n        "Developed a referral program for a FinTech application, enhancing network shareability by 100% using React, React Native, and Typescript",\n        "Managed a DocumentDB database deployment on Amazon EC2, migrating existing clusters from MongoDB",\n        "Acquired expertise in AWS, database architecture, and Linux instances",\n        "Demonstrated strong teamwork skills and adaptability in rapid sprint timelines, collaborating with designers for UI implementation and ensuring backend data security"\n      ]\n    }\n  ],\n  "Projects": [\n    {\n      "company": "Sparkmate Inc.",\n      "title": "Founder, CTO",\n      "start": "May 2022",\n      "end": "Jan 2023",\n      "location": "New York, NY",\n      "description": [\n        "Led the design, architecture, and development of a unique dating app as the sole technology owner, demonstrating a proven track record in software development",\n        "Selected technology and architecture for the app to operate at scale, showcasing solid computer science fundamentals",\n        "Collaborated with the product owner to develop a profile-matching algorithm and a queuing algorithm for live video chat, powered by WebRTC"\n      ]\n    },\n    {\n      "company": "Data Science Society",\n      "title": "ML Project Creator / Leader",\n      "start": "September 2020",\n      "end": "May 2021",\n      "location": "Berkeley, CA",\n      "description": [\n        "Utilized Python and related libraries to develop an algorithm for political article analysis, demonstrating excellent problem-solving skills",\n        "Processed a dataset of 15,000+ articles using VADER sentiment analysis and other data science/ML techniques, achieving over 80% accuracy",\n        "Led a team in the creation of the algorithm and its accompanying data visualizations, demonstrating strong communication and teamwork skills"\n      ]\n    }\n  ]\n}
"""