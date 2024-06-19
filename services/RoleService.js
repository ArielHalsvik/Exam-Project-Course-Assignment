const { sequelize } = require("../models");

class RoleService {
  constructor(db) {
    this.client = db.sequelize;
    this.Role = db.Role;
  }

  /* Gets all Roles */
  async getAllRoles() {
    try {
      return this.Role.findAll({
        where: {},
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Gets one Role */
  async getOneRole(name, value) {
    try {
      return this.Role.findOne({
        where: {
          [name]: value,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Creates a Role */
  async createRole(role) {
    try {
      return this.Role.create({
        Role: role,
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Updates a Role */
  async updateRole(roleId, role) {
    try {
      return this.Role.update({ Role: role }, { where: { RoleId: roleId } });
    } catch (error) {
      console.error(error);
    }
  }

  /* Deletes a Role */
  async deleteRole(roleId) {
    try {
      return this.Role.destroy({
        where: { RoleId: roleId },
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Inserts Roles */
  async insertRoles() {
    try {
      const data = require("../data/roles.json");
      for (const role of data) {
        await sequelize.query(role.query, {
          raw: true,
          type: sequelize.QueryTypes.INSERT,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  /* Checks if a Role is in use */
  async roleInUse(roleId) {
    try {
      let data = await this.client.query(
        `SELECT COUNT(*) AS total FROM users WHERE users.RoleId = ${roleId}`,
        {
          raw: true,
          type: sequelize.QueryTypes.SELECT,
        }
      );
      if (data[0].total > 0) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = RoleService;
