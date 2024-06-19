/* Edit User */
async function editUser(
  roles,
  userId,
  email,
  firstName,
  lastName,
  address,
  telephoneNumber,
  currentRole
) {
  const data = JSON.parse(roles);

  const roleOptions = data
    .map((role) => {
      if (role.Role === currentRole) {
        return `<option value="${role.RoleId}" selected>${role.Role}</option>`;
      } else {
        return `<option value="${role.RoleId}">${role.Role}</option>`;
      }
    })
    .join("");

  Swal.fire({
    title: "Edit user details",
    html: `
            <div>
              <label for="userId" class="form-label">User ID</label>
              <input name="userId" class="form-control" type="number" value="${userId}" disabled>
      
              <label for="email" class="form-label">Email</label>
              <input id="emailInput" name="name" class="form-control" type="text" value="${email}">
      
              <label for="firstName" class="form-label">First Name</label>
              <input id="firstNameInput" name="name" class="form-control" type="text" value="${firstName}">
      
              <label for="lastName" class="form-label">Last Name</label>
              <input id="lastNameInput" name="name" class="form-control" type="text" value="${lastName}">
      
              <label for="address" class="form-label">Address</label>
              <input id="addressInput" name="name" class="form-control" type="text" value="${address}">
      
              <label for="telephoneNumber" class="form-label">Telephone Number</label>
              <input id="telephoneNumberInput" name="telephoneNumber" class="form-control" type="number" value="${telephoneNumber}">

              <label for="Role" class="form-label">Role</label>
              <select id="roleSelect" class="form-select">${roleOptions}</select>
            </div>
          `,
    showCancelButton: true,
    confirmButtonText: "Save changes",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch("/auth/" + userId, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailInput.value,
            firstName: firstNameInput.value,
            lastName: lastNameInput.value,
            address: addressInput.value,
            telephoneNumber: telephoneNumberInput.value,
            roleId: roleSelect.value,
          }),
        });

        if (!response.ok) {
          const errorMessage = await response.json();
          return Swal.fire({
            icon: "error",
            title: "Error",
            text: errorMessage.data.result,
          });
        }

        Swal.fire({
          title: "Changes saved",
          text: "User details updated successfully.",
          icon: "success",
        }).then(() => {
          location.reload();
        });
      } catch (error) {
        console.error("User could not be updated: ", error);
      }
    }
  });
}
