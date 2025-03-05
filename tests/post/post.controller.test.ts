import { Request, Response, NextFunction } from "express";
import {
  createPost,
  getPostsByUserId,
  deletePost,
} from "../../src/controllers/postController";
import User from "../../src/models/User";
import Post from "../../src/models/Post";
import { userData, postData } from "../helpers";

// Mock the response object
const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

const mockNext = jest.fn() as NextFunction;

describe("Post Controller", () => {
  let user: User;

  beforeEach(async () => {
    await Post.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });

    user = await User.create(userData);

    jest.clearAllMocks();
  });

  describe("createPost", () => {
    it("should create a post successfully", async () => {
      const req = {
        body: {
          ...postData,
          userId: user.id,
        },
      } as Request;

      const res = mockResponse();

      await createPost(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();

      const responseBody = (res.json as jest.Mock).mock.calls[0][0];
      expect(responseBody.status).toBe("success");
      expect(responseBody.data.title).toBe(postData.title);
      expect(responseBody.data.body).toBe(postData.body);
      expect(responseBody.data.userId).toBe(user.id);
    });

    it("should handle user not found", async () => {
      const req = {
        body: {
          ...postData,
          userId: 999,
        },
      } as Request;

      const res = mockResponse();

      await createPost(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should handle validation errors => Missing required fields", async () => {
      const req = {
        body: {
          userId: user.id,
        },
      } as Request;

      const res = mockResponse();

      await createPost(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("getPostsByUserId", () => {
    it("should get posts by user ID", async () => {
      await Post.create({
        ...postData,
        title: "First Post",
        userId: user.id,
      });

      await Post.create({
        ...postData,
        title: "Second Post",
        userId: user.id,
      });

      const req = {
        query: {
          userId: user.id.toString(),
        },
      } as unknown as Request;

      const res = mockResponse();

      await getPostsByUserId(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();

      const responseBody = (res.json as jest.Mock).mock.calls[0][0];
      expect(responseBody.status).toBe("success");
      expect(responseBody.data.length).toBe(2);
    });

    it("should return empty array for user with no posts", async () => {
      const req = {
        query: {
          userId: user.id.toString(),
        },
      } as unknown as Request;

      const res = mockResponse();

      await getPostsByUserId(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();

      const responseBody = (res.json as jest.Mock).mock.calls[0][0];
      expect(responseBody.status).toBe("success");
      expect(responseBody.data.length).toBe(0);
    });

    it("should handle user not found", async () => {
      const req = {
        query: {
          userId: "999",
        },
      } as unknown as Request;

      const res = mockResponse();

      await getPostsByUserId(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should handle missing user ID", async () => {
      const req = {
        query: {},
      } as unknown as Request;

      const res = mockResponse();

      await getPostsByUserId(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("deletePost", () => {
    it("should delete a post successfully", async () => {
      const post = await Post.create({
        ...postData,
        userId: user.id,
      });

      const req = {
        params: {
          id: post.id.toString(),
        },
      } as unknown as Request;

      const res = mockResponse();

      await deletePost(req, res, mockNext);

      //   expect(res.status).toHaveBeenCalledWith(204);

      const deletedPost = await Post.findByPk(post.id);
      expect(deletedPost).toBeNull();
    });

    it("should handle post not found", async () => {
      const req = {
        params: {
          id: "999",
        },
      } as unknown as Request;

      const res = mockResponse();

      await deletePost(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });
});
