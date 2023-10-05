import supertest from "supertest";

// Initialize supertest agent. Replace 'http://localhost:3000' with your API's URL
const agent = supertest("http://localhost:3000");

describe("POST /api/parse_resume", () => {
  it("Should return 400 status when fields are missing.", async () => {
    // Here supertest makes a POST request to /api/parse_resume with an empty body
    const response = await agent
      .post("/api/parse_resume")
      .send({})
      .set("Content-Type", "application/json");

    expect(response.status).toBe(400);
  });

  it("Should return 400 status when fields are missing.", async () => {
    const response = await agent
      .post("/api/parse_resume")
      .send({
        "resume_raw_text": "Test text."
      })
      .set("Content-Type", "application/json");

    expect(response.status).toBe(400);
  });

  it("Should return 400 status when fields are missing.", async () => {
    const response = await agent
      .post("/api/parse_resume")
      .send({
        "job_posting_text": "Test text."
      })
      .set("Content-Type", "application/json");

    expect(response.status).toBe(400);
  });

  it("Should return 400 status when resume is too long.", async () => {
    const response = await agent
      .post("/api/parse_resume")
      .send({
        "resume_raw_text": "Test text.".repeat(10000),
        "job_posting_text": "Test text."
      })
      .set("Content-Type", "application/json");
    
    // console.log(response);

    expect(response.status).toBe(400);
  });

  it("Should return an edited resume in JSON.", async () => { 
    const response = await agent
      .post("/api/parse_resume")
      .send({
        "resume_raw_text": "Test text.",
        "job_posting_text": "Test text."
      })
      .set("Content-Type", "application/json");
    
    console.log(response.text);

    expect(response.status).toBe(200);
  });

  // it("Should return 200 and tailored JSON if everything is okay", async () => {
  //   const response = await agent
  //     .post("/api/parse_resume")
  //     .send({
  //       resume_raw_text: "some text",
  //       job_posting_text: "some text",
  //     })
  //     .set("Content-Type", "application/json");

  //   expect(response.status).toBe(200);
  //   expect(response.body).toEqual({ some: "json" });
  // });
});
