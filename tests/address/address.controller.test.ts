import { Request, Response, NextFunction } from "express";
import {
  createAddress,
  getAddressByUserId,
  updateAddress,
} from "../../src/controllers/addressController";
import User from "../../src/models/User";
import Address from "../../src/models/Address";
import { userData, addressData } from "../helpers";
import { AppError } from "../../src/middleware/errorHandler";

// Mock the response object
const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

const mockNext = jest.fn() as NextFunction;

describe("Address Controller", () => {
  let user: User;

  beforeEach(async () => {
    await Address.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });

    user = await User.create(userData);

    jest.clearAllMocks();
  });

  describe("createAddress", () => {
    it("should create an address for a user successfully", async () => {
      const req = {
        body: {
          ...addressData,
          userId: user.id,
        },
      } as Request;

      const res = mockResponse();

      await createAddress(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();

      const responseBody = (res.json as jest.Mock).mock.calls[0][0];
      expect(responseBody.status).toBe("success");
      expect(responseBody.data.street).toBe(addressData.street);
      expect(responseBody.data.city).toBe(addressData.city);
      expect(responseBody.data.state).toBe(addressData.state);
      expect(responseBody.data.zipCode).toBe(addressData.zipCode);
      expect(responseBody.data.userId).toBe(user.id);
    });

    it("should handle user not found", async () => {
      const req = {
        body: {
          ...addressData,
          userId: 999495945,
        },
      } as Request;

      const res = mockResponse();

      await createAddress(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should handle validation errors => Missing required fields", async () => {
      const req = {
        body: {
          userId: user.id,
        },
      } as Request;

      const res = mockResponse();

      await createAddress(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("getAddressByUserId", () => {
    it("should get address by user ID", async () => {
      await Address.create({
        ...addressData,
        userId: user.id,
      });

      const req = {
        query: {
          userId: user.id.toString(),
        },
      } as unknown as Request;

      const res = mockResponse();

      await getAddressByUserId(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();

      const responseBody = (res.json as jest.Mock).mock.calls[0][0];
      expect(responseBody.status).toBe("success");
      expect(responseBody.data.street).toBe(addressData.street);
      expect(responseBody.data.userId).toBe(user.id);
    });

    it("should handle address not found => Existing user", async () => {
      const req = {
        query: {
          userId: user.id.toString(),
        },
      } as unknown as Request;

      const res = mockResponse();

      await getAddressByUserId(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should handle user not found => Non-existent user ID", async () => {
      const req = {
        query: {
          userId: "99999979",
        },
      } as unknown as Request;

      const res = mockResponse();

      await getAddressByUserId(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should handle missing user ID", async () => {
      const req = {
        query: {},
      } as unknown as Request;

      const res = mockResponse();

      await getAddressByUserId(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("updateAddress", () => {
    it("should handle address not found", async () => {
      const req = {
        params: {
          userID: user.id.toString(),
        },
        body: {
          street: "789 Updated St",
        },
      } as unknown as Request;

      const res = mockResponse();

      await updateAddress(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should handle user not found", async () => {
      const req = {
        params: {
          userID: "999",
        },
        body: {
          street: "789 Updated St",
        },
      } as unknown as Request;

      const res = mockResponse();

      await updateAddress(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });
});
