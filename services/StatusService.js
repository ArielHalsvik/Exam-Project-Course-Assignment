const { sequelize } = require("../models");

class StatusService {
  constructor(db) {
    this.client = db.sequelize;
    this.Status = db.Status;
  }

  /* Gets all Statuses */
  async getAllStatuses() {
    try {
      return this.Status.findAll({
        where: {},
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Gets one Status */
  async getOneStatus(name, value) {
    try {
      return this.Status.findOne({
        where: {
          [name]: value,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Creates a Status */
  async createStatus(status) {
    try {
      return this.Status.create({
        Status: status,
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Updates a Status */
  async updateStatus(statusId, status) {
    try {
      return this.Status.update(
        { Status: status },
        { where: { StatusId: statusId } }
      );
    } catch (error) {
      console.error(error);
    }
  }

  /* Deletes a Status */
  async deleteStatus(statusId) {
    try {
      return this.Status.destroy({
        where: { StatusId: statusId },
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Checks if a Status is in use */
  async statusInUse(statusId) {
    try {
      let data = await this.client.query(
        `SELECT COUNT(*) AS total FROM orders WHERE orders.StatusId = ${statusId}`,
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

  /* Inserts Statuses into the Database */
  async insertStatuses() {
    try {
      const data = require("../data/statuses.json");
      for (const status of data) {
        await sequelize.query(status.query, {
          raw: true,
          type: sequelize.QueryTypes.INSERT,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = StatusService;
