// const request = require("supertest");
// const app = require("../index");
// const { transaction } = require("../models");


// describe("GET /v1/trans", () => {
//   let trans;

//   beforeEach(async () => {
//     trans = await transaction.create({
//       ticketId: 1,
//       userId: 3,
//       orderBy: "Roger Sumatra",
//       ktp: "3578140092900193",
//       numChair: 18,
//     });

//     return trans;
//   });

//   afterEach(() => trans.destroy());

//   it("should response with 200 as status code", async () => {
//     const ticketId = 1;
//     const userId = 3;
//     const orderBy = "Roger Sumatra";
//     const ktp = "3578140092900193";
//     const numChair = 18;

//     return request(app)
//       .get("/v1/tasks")
//       .then((res) => {
//         expect(res.statusCode).toBe(200);
//         expect(res.body).toEqual(
//           expect.arrayContaining([
//             expect.objectContaining({
//               ticketId,
//               userId,
//               orderBy,
//               ktp,
//               numChair,
//             }),
//           ])
//         );
//       });
//   });
// });


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


// describe("POST /v1/trans/:ticketId", () => {
//   it("should response with 201 as status code", async () => {
//     const ticketId = 1;
//     const userId = 3;
//     const orderBy = "Roger Sumatra";
//     const ktp = "3578140092900193";
//     const numChair = 18;
    // const code = "DO23TO05AR07000";
    // const flight = "DOMESTIC";
    // const departure = "Bandar Udara Internasional Sultan Iskandar Muda, Banda Aceh";
    // const departureCode = "BTJ";
    // const destination = "Bandar Udara Sultan Aji Muhammad Sulaiman, Balikpapan";
    // const destinationCode = "BPN";
    // const type = "Adult";
    // const tclass = "Business";
    // const takeOff = new Date();
    // const arrive = new Date();
    // const price = 3000000;
    // const totalChair = 100;
    // const createdAt = new Date();
    // const updatedAt = new Date();

//     return request(app)
//       .post("/v1/trans/:ticketId")
//       .set("Content-Type", "application/json")
//       .send({ ticketId, userId, orderBy, ktp, numChair })
//       .then((res) => {
//         expect(res.statusCode).toBe(201);
//       });
//   });
// });

// describe("PUT /v1/ticket/:id", () => {
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
//     const code = "DO23TO05AR07000";
//     const flight = "DOMESTIC";
//     const departure = "Bandar Udara Internasional Sultan Iskandar Muda, Banda Aceh";
//     const departureCode = "BTJ";
//     const destination = "Bandar Udara Sultan Aji Muhammad Sulaiman, Balikpapan";
//     const destinationCode = "BPN";
//     const type = "Adult";
//     const tclass = "Business";
//     const takeOff = new Date();
//     const arrive = new Date();
//     const price = 1500000;
//     const totalChair = 100;
//     const createdAt = new Date();
//     const updatedAt = new Date();

//     return request(app)
//       .put("/v1/ticket/" + ticket.id)
//       .set("Content-Type", "application/json")
//       .send({ code, flight, departure, departureCode, destination, destinationCode, type, tclass, takeOff, arrive, price, totalChair, createdAt, updatedAt })
//       .then((res) => {
//         expect(res.statusCode).toBe(200);
//       });
//   });
// });

// describe("DELETE /v1/ticket/:id", () => {
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

//   it("should response with 204 as status code", async () => {
//     return request(app)
//       .delete("/v1/ticket/" + ticket.id)
//       .then((res) => {
//         expect(res.statusCode).toBe(204);
//       });
//   });

// });
