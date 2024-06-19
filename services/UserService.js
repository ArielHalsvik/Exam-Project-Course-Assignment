const { sequelize } = require("../models");

class UserService {
  constructor(db) {
    this.client = db.sequelize;
    this.User = db.User;
  }

  /* Gets all Users */
  async getAllUsers() {
    try {
      const users = await sequelize.query(
        `
          SELECT
          u.Id AS Id,
          u.FirstName AS FirstName,
          u.LastName AS LastName,
          u.UserName AS UserName,
          u.Email AS Email,
          u.Address AS Address,
          u.TelephoneNumber AS TelephoneNumber,
          r.Role AS Role,
          m.Membership AS Membership
          FROM users u
          LEFT JOIN roles r
          ON u.RoleId = r.RoleId
          LEFT JOIN memberships m
          ON u.MembershipId = m.MembershipId
        `,
        {
          raw: true,
          type: sequelize.QueryTypes.SELECT,
        }
      );
      return users;
    } catch (error) {
      console.error(error);
    }
  }

  /* Gets one User */
  async getOneUser(name, value) {
    try {
      return this.User.findOne({
        where: {
          [name]: value,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Creates a User */
  async createUser(
    firstName,
    lastName,
    userName,
    email,
    encryptedPassword,
    salt,
    address,
    telephoneNumber,
    roleId
  ) {
    try {
      return this.User.create({
        FirstName: firstName,
        LastName: lastName,
        UserName: userName,
        Email: email,
        EncryptedPassword: encryptedPassword,
        Salt: salt,
        Address: address,
        TelephoneNumber: telephoneNumber,
        RoleId: roleId,
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Updates a User */
  async updateUser(
    userId,
    firstName,
    lastName,
    email,
    address,
    telephoneNumber,
    roleId
  ) {
    try {
      return this.User.update(
        {
          FirstName: firstName,
          LastName: lastName,
          Email: email,
          Address: address,
          TelephoneNumber: telephoneNumber,
          RoleId: roleId,
        },
        { where: { Id: userId } }
      );
    } catch (error) {
      console.error(error);
    }
  }

  /* Upgrades a User's Membership */
  async upgradeMembership(id, membershipId) {
    try {
      return this.User.update(
        { MembershipId: membershipId },
        { where: { Id: id } }
      );
    } catch (error) {
      console.error(error);
    }
  }

  /* Deletes a User */
  async deleteUser(id) {
    try {
      return this.User.destroy({
        where: { Id: id },
      });
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = UserService;
