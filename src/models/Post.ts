import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";
import User from "./User";

interface PostAttributes {
  id: number;
  title: string;
  body: string;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PostCreationAttributes
  extends Optional<PostAttributes, "id"> {}

class Post
  extends Model<PostAttributes, PostCreationAttributes>
  implements PostAttributes
{
  public id!: number;
  public title!: string;
  public body!: string;
  public userId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "posts",
    timestamps: true,
  }
);

User.hasMany(Post, {
  foreignKey: "userId",
  as: "posts",
  onDelete: "CASCADE",
});

Post.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

export default Post;
