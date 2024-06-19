var express = require("express");
var router = express.Router();
var db = require("../models");
var RoleService = require("../services/RoleService");
var roleService = new RoleService(db);

var isAdmin = require("../middleware/isAdmin");
var errorMessage = require("../middleware/errorMessage");
var successMessage = require("../middleware/successMessage");
var checkRole = require("../middleware/checkRole");

/* Get all Roles */
router.get("/", async (req, res, next) => {
  // #swagger.tags = ['Roles']
  // #swagger.description = 'Gets all roles from the database.'
  // #swagger.responses = [200]
  try {
    const roleData = await roleService.getAllRoles();

    return successMessage(res, "Roles found successfully.", "roles", roleData);
  } catch (error) {
    return errorMessage(res, "Roles could not be fetched.");
  }
});

/* Create a Role */
router.post("/", isAdmin, checkRole, async (req, res, next) => {
  // #swagger.tags = ['Roles']
  // #swagger.description = 'Creates a new role.'
  // #swagger.responses = [200]
  /* #swagger.parameters['body'] = {
      "name": "body",
      "in": "body",
      "schema": {
        "$ref": "#/definitions/Role"
      }
    }
  */
  const { role } = req.body;

  try {
    const roleData = await roleService.createRole(role);

    return successMessage(res, "Role created successfully.", "role", roleData);
  } catch (error) {
    return errorMessage(res, "Role could not be created.");
  }
});

/* Change a Role */
router.put("/:roleId", isAdmin, checkRole, async (req, res, next) => {
  // #swagger.tags = ['Roles']
  // #swagger.description = 'Updates a specific role.'
  // #swagger.responses = [200]
  /* #swagger.parameters['body'] = {
      "name": "body",
      "in": "body",
      "schema": {
        "$ref": "#/definitions/Role"
      }
    }
  */
  const { roleId } = req.params;
  const { role } = req.body;

  try {
    await roleService.updateRole(roleId, role);

    return successMessage(res, "Role updated successfully.", "role", role);
  } catch (error) {
    return errorMessage(res, "Role could not be updated.");
  }
});

/* Delete a Role */
router.delete("/:roleId", isAdmin, checkRole, async (req, res, next) => {
  // #swagger.tags = ['Roles']
  // #swagger.description = 'Deletes a specific role.'
  // #swagger.responses = [200]
  const { roleId } = req.params;

  try {
    await roleService.deleteRole(roleId);

    return successMessage(res, "Role deleted successfully.", "role", roleId);
  } catch (error) {
    return errorMessage(res, "Role could not be deleted.");
  }
});

module.exports = router;
