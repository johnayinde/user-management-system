import User from "../src/models/User";
import Address from "../src/models/Address";
import Post from "../src/models/Post";

// Sample data for testing
export const userData = {
  firstName: "John",
  lastName: "Boy",
  email: "johnny.boy@gmail.com",
};

export const addressData = {
  street: "AJ street",
  city: "Lagos",
  state: "LG",
  zipCode: "12345",
};

export const postData = {
  title: "Test Post",
  body: "This is a test post body with some content.",
};

export const createTestUser = async () => {
  return await User.create(userData);
};


export const createTestUserWithAddress = async () => {
  const user = await User.create(userData);
  const address = await Address.create({
    ...addressData,
    userId: user.id,
  });
  return { user, address };
};

export const createTestUserWithPosts = async (postCount = 3) => {
  const user = await User.create(userData);
  const posts: Post[] = [];

  for (let i = 0; i < postCount; i++) {
    posts.push(
      await Post.create({
        ...postData,
        title: `${postData.title} ${i + 1}`,
        userId: user.id,
      })
    );
  }

  return { user, posts };
};

export const createTestUserWithAddressAndPosts = async (postCount = 3) => {
  const { user, address } = await createTestUserWithAddress();
  const posts: Post[] = [];

  for (let i = 0; i < postCount; i++) {
    posts.push(
      await Post.create({
        ...postData,
        title: `${postData.title} ${i + 1}`,
        userId: user.id,
      })
    );
  }

  return { user, address, posts };
};
