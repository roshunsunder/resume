const { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableCell, TableRow, TabStopType } = require('docx');
const fs = require('fs')

const renderExperience = (org, location, position, start, end) => {
    return [
    new Paragraph({
        children : [
            new TextRun({
                text: org,
                bold: true
            }),
            new TextRun("\t"),
            new TextRun({
                text: location,
                bold: true
            })
        ],
        tabStops : [
            {
                type: TabStopType.RIGHT,
                position: 11520 // 1 inch = 1440 twips, so this is 8 inches from left because margin is 0.5
            }
        ]
    }),
    new Paragraph({
        children : [
            new TextRun({
                text: position,
                italics: true
            }),
            new TextRun("\t"),
            new TextRun({
                text: `${start} - ${end}`
            })
        ],
        tabStops : [
            {
                type: TabStopType.RIGHT,
                position: 11520 // 1 inch = 1440 twips, so this is 8 inches from left because margin is 0.5
            }
        ]
    })
]
}

const renderBulletPoints = (...texts) => {
    return texts.map(text => new Paragraph({
        children: [new TextRun({ text: text })],
        bullet: {
            level: 0
        }
    }));
}

const addSection = (title) => {
    return new Paragraph({
        border: {
            bottom: {
                color: "auto",
                space: 1,
                style: "single",
                size: 6
            }
        },
        children: [
            new TextRun({
                text: title,
                bold: true
            })
        ]
    })
}

const doc = new Document({
    sections: [
        {
            properties: {
                margins: {
                    top: 1080,
                    bottom: 1080,
                    left: 1080,
                    right: 1080
                }
            },
            children: [
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            text: "[Name]",
                            bold: true,
                            size: 36
                        })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            text: "[Physical Address]",
                        }),
                        new TextRun({
                            text: "[Phone Number] | [Email Address][Github /personal website if applicable]",
                            break:1
                        }),
                    ],

                }),
                // <Education>
                addSection("EDUCATION"),
                new Paragraph({
                    children : [
                        new TextRun({
                            text: "[University Name]",
                            bold: true
                        }),
                        new TextRun("\t"),
                        new TextRun({
                            text : "[City], [State/Country]",
                            bold : true
                        })
                    ],
                    tabStops : [
                        {
                            type: TabStopType.RIGHT,
                            position: 11520 // 1 inch = 1440 twips, so this is 8 inches from left because margin is 0.5
                        }
                    ]
                }),
                new Paragraph({
                    children : [
                        new TextRun({
                            text: "Bachelor of [Arts/Science] in [Major]",
                            italics: true
                        }),
                        new TextRun("\t"),
                        new TextRun({
                            text: "[Start Date] - [End Date]"
                        })
                    ],
                    tabStops : [
                        {
                            type: TabStopType.RIGHT,
                            position: 11520 // 1 inch = 1440 twips, so this is 8 inches from left because margin is 0.5
                        }
                    ]
                }),
                // </Education>

                new Paragraph(""),
                // </Work & Leadership Experience>
                addSection("WORK & LEADERSHIP EXPERIENCE"),
                ...renderExperience(
                    "[Company Name/ Student Club Name]",
                    "[City], [State/Country]",
                    "[Position Title]",
                    "[Start Date]",
                    "[End Date]"
                ),
                ...renderBulletPoints(
                    "Bullet Point 1",
                    "Bullet Point 2",
                    "Bullet Point 3"
                ),
                ...renderExperience(
                    "[Company Name/ Student Club Name]",
                    "[City], [State/Country]",
                    "[Position Title]",
                    "[Start Date]",
                    "[End Date]"
                ),
                ...renderBulletPoints(
                    "Bullet Point 1",
                    "Bullet Point 2",
                    "Bullet Point 3"
                ),
                ...renderExperience(
                    "[Company Name/ Student Club Name]",
                    "[City], [State/Country]",
                    "[Position Title]",
                    "[Start Date]",
                    "[End Date]"
                ),
                ...renderBulletPoints(
                    "Bullet Point 1",
                    "Bullet Point 2",
                    "Bullet Point 3"
                ),
                addSection("SKILLS")
            ],
        },
    ],
});

// Used to export the file into a .docx file
Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync('document.docx', buffer);
});
