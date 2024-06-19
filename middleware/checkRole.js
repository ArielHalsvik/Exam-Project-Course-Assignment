var db = require("../models");
var RoleService = require("../services/RoleService");
var roleService = new RoleService(db);
var errorMessage = require("../middleware/errorMessage");

/* Validates Role Endpoints */
async function checkRole(req, res, next) {
  const { roleId } = req.params;
  const { role } = req.body;

  try {
    if (roleId) {
      const existingRole = await roleService.getOneRole("RoleId", roleId);
      if (!existingRole) {
        return errorMessage(res, "Role not found. Please use a valid role ID.");
      }

      /* Validation for DELETE */
      if (req.method === "DELETE") {
        const roleInUse = await roleService.roleInUse(roleId);
        if (roleInUse) {
          return errorMessage(res, "Role is in use and cannot be deleted.");
        }
      }
    }

    /* Validation for POST and PUT */
    if (req.method === "POST" || req.method === "PUT") {
      if (!role) {
        return errorMessage(res, "Please provide a role.");
      }

      if (!/^[a-zA-Z\s]+$/.test(role)) {
        return errorMessage(res, "Please only use letters in the role name.");
      }

      const duplicateRole = await roleService.getOneRole("Role", role);
      if (duplicateRole) {
        return errorMessage(
          res,
          "Role already exists. Please choose a different name."
        );
      }
    }
    next();
  } catch (error) {
    return errorMessage(res, "Could not validate role.");
  }
}

module.exports = checkRole;
