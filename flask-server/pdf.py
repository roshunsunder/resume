from fpdf import FPDF
import json

class PDFWrapper():
    # Rules: 
    # Each function ought to leave a newline space at the end of their procedure
    # Ecah function ought to set the required styling at the beginning of their procedure
    def __init__(self):
        self.indent = 72
        self.newline = 14
        self.pdf = FPDF(orientation='P', unit='pt', format='Letter')
        self.pdf.add_page()
        self.pdf.set_left_margin(self.indent)
        self.pdf.set_right_margin(self.indent)
    
    def output(self, name: str):
        self.pdf.output(name)
    
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
    
    def add_generic_section(self, name: str, data: list):
        self.pdf.set_font('Times', 'B', size=10)
        self.pdf.cell(w=0, h=0, align='L', txt=name)
        self.__add_line()
        for entry in data:
            self.__add_job_title(entry['company'], entry['title'], entry['location'], entry['start'], entry['end'])
            self.__bulleted_list(entry['description'])
        self.pdf.ln(h=self.newline)
    
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
        first_line = f"{degree},{concentration}. {GPA}" if len(degree) else f"{concentration}. {GPA}"
        self.pdf.cell(w=self.pdf.epw / 2, txt= first_line, align='L')
        self.pdf.cell(w=self.pdf.epw / 2, txt = graduation, align='R')


        self.pdf.ln(self.newline + 10)
res = """
\n[\n  {\n    "company": "Cedar Inc.",\n    "title": "Software Engineering Intern",\n    "start": "May 2022",\n    "end": "August 2022",\n    "location": "New York, NY",\n    "description": [\n      "Designed and developed software solutions in Python and Django for a FinTech unicorn in an Agile environment, demonstrating solid computer science fundamentals.",\n      "Developed a notification system to streamline patient communication, showcasing excellent problem-solving skills.",\n      "Deployed code to a production environment, managing multiple tasks in a dynamic environment and reducing unnecessary call volume by over 95%."\n    ]\n  },\n  {\n    "company": "Neck App",\n    "title": "Software Engineering Intern",\n    "start": "May 2021",\n    "end": "September 2021",\n    "location": "New York, NY",\n    "description": [\n      "Designed and developed a referral program for a FinTech application using React and Typescript, demonstrating proficiency in multiple programming languages.",\n      "Managed a DocumentDB database deployment on Amazon EC2, showcasing a proven track record in software development.",\n      "Gained experience with AWS and Linux instances, furthering technical skills.",\n      "Worked on rapid sprint timelines, demonstrating strong communication and teamwork skills while ensuring data security."\n    ]\n  }\n]\n
"""

doc = PDFWrapper()
doc.add_title('Roshun Sunder', '508 W 114th St, New York, NY 10025', 'roshun.sunder@gmail.com', '503-686-3249', 'roshunsunder.com')
doc.add_education('Columbia University', 'New York, NY', 'May 2024', 'Computer Science', degree='BA', GPA='3.8')
doc.add_generic_section('EXPERIENCE', json.loads(res))
doc.output('automated.pdf')