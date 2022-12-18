// const request = require("supertest");
// const app = require("../index");
// const { User } = require("../models");


// describe("GET /v1/admin/all", () => {
//     describe("getting all admin data", () => {
//       test("should respond with a 200 status code", async () => {
//         const response = await request(app).get("/v1/admin/all")
//         expect(response.statusCode).toBe(200)
//       })
//     })
// })

// describe("GET /v1/ticket/:id", () => {
//   let ticket;

//   beforeEach(async () => {
//     ticket = await Ticket.create({
//       code: "DO22TO05AR05000",
//       flight: "DOMESTIC",
//       departure: "Bandar Udara Internasional Sultan Iskandar Muda, Banda Aceh",
//       departureCode: "BTJ",
//       destination: "Bandar Udara Sultan Aji Muhammad Sulaiman, Balikpapan",
//       destinationCode: "BPN",
//       type: "Adult",
//       class: "Business",
//       takeOff: new Date(),
//       arrive: new Date(),
//       price: 3000000,
//       totalChair: 100,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     });
//     return ticket;
//   });

//   afterEach(() => ticket.destroy());

//   it("should response with 200 as status code", async () => {
//     return request(app)
//       .get("/v1/ticket/" + ticket.id)
//       .then((res) => {
//         expect(res.statusCode).toBe(200);
//       });
//   });
// });


