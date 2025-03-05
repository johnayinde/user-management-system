import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";
import User from "./User";

interface AddressAttributes {
  id: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AddressCreationAttributes
  extends Optional<AddressAttributes, "id"> {}

class Address
  extends Model<AddressAttributes, AddressCreationAttributes>
  implements AddressAttributes
{
  public id!: number;
  public street!: string;
  public city!: string;
  public state!: string;
  public zipCode!: string;
  public userId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Address.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "addresses",
    timestamps: true,
  }
);

User.hasOne(Address, {
  foreignKey: "userId",
  as: "address",
  onDelete: "CASCADE",
});

Address.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

export default Address;
