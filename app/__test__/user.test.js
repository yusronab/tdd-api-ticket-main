const request = require("supertest");
const app = require("../../app");

describe("POST /v1/user/register", () => {
  it("should response with 201 as status code", async () => {
    const name = "Cristiano Faishalo";
    const email = "faishal@gmail.com";
    const password = "faishal";
    const image = "https://res.cloudinary.com/dptgh7efj/image/upload/v1668438995/user/k4qprdipa96sl2c3ugd0.jpg";
    const phone = "+62 898 1234 4321";
    const birth = new Date("02/02/2022");
    const role = "member";
    const isExist = true;
    const isVerify = true;
    const createdAt = new Date();
    const updatedAt = new Date();

    return request(app)
      .post("/v1/user/register")
      .set("Content-Type", "application/json")
      .send({ name, email, password, image, phone, birth, role, isExist, isVerify, createdAt, updatedAt })
      .then((res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual(
          expect.objectContaining({
            ...res.body,
            name,
            email,
            password,
            image,
            phone, 
            irth,
            role,
            isExist,
            isVerify,
            createdAt,
            updatedAt
          })
        );
      });
  });

  it("should response with 422 as status code", async () => {
    const name = [];
    const email = [];
    const password = [];
    const image = [];
    const phone = [];
    const birth = [];
    const role = [];
    const isExist = [];
    const isVerify = [];
    const createdAt = [];
    const updatedAt = [];

    return request(app)
      .post("/v1/user/register")
      .set("Content-Type", "application/json")
      .send({ name, email, password, image, phone, birth, role, isExist, isVerify, createdAt, updatedAt })
      .then((res) => {
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual(
          expect.objectContaining({
            error: {
              name: expect.any(String),
              email: expect.any(String),
              password: expect.any(String),
              image: expect.any(String),
              phone: expect.any(String), 
              birth: expect.any(String),
              role: expect.any(String),
              isExist: expect.any(String),
              isVerify: expect.any(String),
              createdAt: expect.any(String),
              updatedAt: expect.any(String)
            },
          })
        );
      });
  });
});

