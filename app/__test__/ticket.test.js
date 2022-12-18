const request = require("supertest");
const app = require("../index");
const { Ticket } = require("../models");


describe("GET /v1/ticket", () => {
    describe("getting all ticket data", () => {
      test("should respond with a 200 status code", async () => {
        const response = await request(app).get("/v1/ticket")
        expect(response.statusCode).toBe(200)
      })
    })
})

describe("GET /v1/ticket-doms", () => {
    describe("getting all ticket data", () => {
      test("should respond with a 200 status code", async () => {
        const response = await request(app).get("/v1/ticket-doms")
        expect(response.statusCode).toBe(200)
      })
    })
})

describe("GET /v1/ticket-intr", () => {
    describe("getting all ticket data", () => {
      test("should respond with a 200 status code", async () => {
        const response = await request(app).get("/v1/ticket-intr")
        expect(response.statusCode).toBe(200)
      })
    })
})

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


describe("POST /v1/ticket", () => {
  it("should response with 201 as status code", async () => {
    const code = "DO23TO05AR07000";
    const flight = "DOMESTIC";
    const departure = "Bandar Udara Internasional Sultan Iskandar Muda, Banda Aceh";
    const departureCode = "BTJ";
    const destination = "Bandar Udara Sultan Aji Muhammad Sulaiman, Balikpapan";
    const destinationCode = "BPN";
    const type = "Adult";
    const tclass = "Business";
    const takeOff = new Date();
    const arrive = new Date();
    const price = 3000000;
    const totalChair = 100;
    const createdAt = new Date();
    const updatedAt = new Date();

    return request(app)
      .post("/v1/ticket")
      .set("Content-Type", "application/json")
      .send({ code, flight, departure, departureCode, destination, destinationCode, type, tclass, takeOff, arrive, price, totalChair, createdAt, updatedAt })
      .then((res) => {
        expect(res.statusCode).toBe(201);
      });
  });
});

describe("PUT /v1/ticket/:id", () => {
  let ticket;

  beforeEach(async () => {
    ticket = await Ticket.create({
      code: "DO22TO05AR05000",
      flight: "DOMESTIC",
      departure: "Bandar Udara Internasional Sultan Iskandar Muda, Banda Aceh",
      departureCode: "BTJ",
      destination: "Bandar Udara Sultan Aji Muhammad Sulaiman, Balikpapan",
      destinationCode: "BPN",
      type: "Adult",
      class: "Business",
      takeOff: new Date(),
      arrive: new Date(),
      price: 3000000,
      totalChair: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return ticket;
  });

  afterEach(() => ticket.destroy());

  it("should response with 200 as status code", async () => {
    const code = "DO23TO05AR07000";
    const flight = "DOMESTIC";
    const departure = "Bandar Udara Internasional Sultan Iskandar Muda, Banda Aceh";
    const departureCode = "BTJ";
    const destination = "Bandar Udara Sultan Aji Muhammad Sulaiman, Balikpapan";
    const destinationCode = "BPN";
    const type = "Adult";
    const tclass = "Business";
    const takeOff = new Date();
    const arrive = new Date();
    const price = 1500000;
    const totalChair = 100;
    const createdAt = new Date();
    const updatedAt = new Date();

    return request(app)
      .put("/v1/ticket/" + ticket.id)
      .set("Content-Type", "application/json")
      .send({ code, flight, departure, departureCode, destination, destinationCode, type, tclass, takeOff, arrive, price, totalChair, createdAt, updatedAt })
      .then((res) => {
        expect(res.statusCode).toBe(200);
      });
  });
});

describe("DELETE /v1/ticket/:id", () => {
  let ticket;

  beforeEach(async () => {
    ticket = await Ticket.create({
      code: "DO22TO05AR05000",
      flight: "DOMESTIC",
      departure: "Bandar Udara Internasional Sultan Iskandar Muda, Banda Aceh",
      departureCode: "BTJ",
      destination: "Bandar Udara Sultan Aji Muhammad Sulaiman, Balikpapan",
      destinationCode: "BPN",
      type: "Adult",
      class: "Business",
      takeOff: new Date(),
      arrive: new Date(),
      price: 3000000,
      totalChair: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return ticket;
  });

  afterEach(() => ticket.destroy());

  it("should response with 204 as status code", async () => {
    return request(app)
      .delete("/v1/ticket/" + ticket.id)
      .then((res) => {
        expect(res.statusCode).toBe(204);
      });
  });

});
