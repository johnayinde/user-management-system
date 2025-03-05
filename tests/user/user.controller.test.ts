import { Request, Response, NextFunction } from "express";
import {
  createUser,
  getUserById,
  getUsers,
  getUserCount,
} from "../../src/controllers/userController";
import User from "../../src/models/User";
import { userData } from "../helpers";

// Mock the response object
const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

const mockNext = jest.fn() as NextFunction;

describe("User Controller", () => {
  beforeEach(async () => {
    await User.destroy({ where: {}, force: true });
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    it("should create a user successfully", async () => {
      const req = {
        body: userData,
      } as Request;

      const res = mockResponse();

      await createUser(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();

      const responseBody = (res.json as jest.Mock).mock.calls[0][0];
      expect(responseBody.status).toBe("success");
      expect(responseBody.data.firstName).toBe(userData.firstName);
      expect(responseBody.data.lastName).toBe(userData.lastName);
      expect(responseBody.data.email).toBe(userData.email);
    });

    it("should handle validation errors=> Missing firstName ", async () => {
      const req = {
        body: {
          lastName: userData.lastName,
          email: userData.email,
        },
      } as Request;

      const res = mockResponse();

      await createUser(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("getUserById", () => {
    it("should get a user by id", async () => {
      const user = await User.create(userData);

      const req = {
        params: {
          id: user.id.toString(),
        },
      } as unknown as Request;

      const res = mockResponse();

      await getUserById(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();

      const responseBody = (res.json as jest.Mock).mock.calls[0][0];
      expect(responseBody.status).toBe("success");
      expect(responseBody.data.id).toBe(user.id);
      expect(responseBody.data.firstName).toBe(userData.firstName);
    });

    it("should handle user not found", async () => {
      const req = {
        params: {
          id: "999",
        },
      } as unknown as Request;

      const res = mockResponse();

      await getUserById(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("getUsers", () => {
    it("should get paginated list of users", async () => {
      await User.bulkCreate([
        userData,
        { ...userData, email: "user2@gmail.com" },
        { ...userData, email: "user3@gmail.com" },
      ]);

      const req = {
        query: {
          pageNumber: "0",
          pageSize: "2",
        },
      } as unknown as Request;

      const res = mockResponse();

      await getUsers(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();

      const responseBody = (res.json as jest.Mock).mock.calls[0][0];
      expect(responseBody.status).toBe("success");
      expect(responseBody.data.length).toBe(2); // =>  2 items per page
      expect(responseBody.pagination.total).toBe(3); // =>  count should be 3
      expect(responseBody.pagination.totalPages).toBe(2); // => have 2 pages
    });
  });

  describe("getUserCount", () => {
    it("should get the total user count", async () => {
      await User.bulkCreate([
        userData,
        { ...userData, email: "user2@example.com" },
        { ...userData, email: "user3@example.com" },
      ]);

      const req = {} as Request;
      const res = mockResponse();

      await getUserCount(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();

      const responseBody = (res.json as jest.Mock).mock.calls[0][0];
      expect(responseBody.status).toBe("success");
      expect(responseBody.data.count).toBe(3);
    });
  });
});
