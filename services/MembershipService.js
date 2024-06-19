const { sequelize } = require("../models");

class MembershipService {
  constructor(db) {
    this.client = db.sequelize;
    this.Membership = db.Membership;
  }

  /* Gets all Memberships */
  async getAllMemberships() {
    try {
      return this.Membership.findAll({
        where: {},
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Gets one Membership */
  async getOneMembership(name, value) {
    try {
      return this.Membership.findOne({
        where: {
          [name]: value,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Creates a Membership */
  async createMembership(membership, purchases, discount) {
    try {
      return this.Membership.create({
        Membership: membership,
        Purchases: purchases,
        Discount: discount,
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Updates a Membership */
  async updateMembership(membershipId, membership, purchases, discount) {
    try {
      return this.Membership.update(
        { Membership: membership, Purchases: purchases, Discount: discount },
        { where: { MembershipId: membershipId } }
      );
    } catch (error) {
      console.error(error);
    }
  }

  /* Deletes a Membership */
  async deleteMembership(membershipId) {
    try {
      return this.Membership.destroy({
        where: { MembershipId: membershipId },
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Inserts Memberships into the Database */
  async insertMemberships() {
    try {
      const data = require("../data/memberships.json");
      for (const membership of data) {
        await sequelize.query(membership.query, {
          raw: true,
          type: sequelize.QueryTypes.INSERT,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  /* Checks if a Membership is in use */
  async membershipInUse(membershipId) {
    try {
      let data = await this.client.query(
        `SELECT COUNT(*) AS total FROM users WHERE users.MembershipId = ${membershipId}`,
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

module.exports = MembershipService;
