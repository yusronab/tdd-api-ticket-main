const request = require("supertest");
const app = require("../../app");
const { Ticket } = require("../models");

describe("GET /v1/ticket", () => {
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
      price: 1500000,
      totalChair: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return ticket;
  });

  afterEach(() => ticket.destroy());

  it("should response with 200 as status code", async () => {
    const code = "DO22TO05AR05000";
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
      .get("/v1/tasks")
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              code,
              flight,
              departure,
              departureCode,
              destination,
              destinationCode,
              type,
              tclass,
              takeOff,
              arrive,
              price,
              totalChair,
              createdAt,
              updatedAt,
            }),
          ])
        );
      });
  });
});
