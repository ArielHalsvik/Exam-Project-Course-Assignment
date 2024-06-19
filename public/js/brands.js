/* Add Brand */
async function addBrand() {
  Swal.fire({
    title: "Add brand",
    html: `
          <div>
            <label for="brand" class="form-label">Brand</label>
            <input id="brandInput" name="name" class="form-control" type="text">
          </div>
        `,
    showCancelButton: true,
    confirmButtonText: "Save changes",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch("/brands", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            brand: brandInput.value,
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
          title: "Brand added",
          text: "Brand added successfully.",
          icon: "success",
        }).then(() => {
          location.reload();
        });
      } catch (error) {
        console.error("Brand could not be added: ", error);
      }
    }
  });
}

/* Edit Brand */
async function editBrand(brandId, brand) {
  Swal.fire({
    title: "Edit brand details",
    html: `
          <div>
            <label for="brandId" class="form-label">Brand ID</label>
            <input name="brandId" class="form-control" type="number" value="${brandId}" disabled>
    
            <label for="brand" class="form-label">Brand</label>
            <input id="brandInput" name="name" class="form-control" type="text" value="${brand}">
          </div>
        `,
    showCancelButton: true,
    confirmButtonText: "Save changes",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch("/brands/" + brandId, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            brand: brandInput.value,
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
          text: "Brand details updated successfully.",
          icon: "success",
        }).then(() => {
          location.reload();
        });
      } catch (error) {
        console.error("Brand could not be updated: ", error);
      }
    }
  });
}

/* Delete Brand */
async function deleteBrand(brandId) {
  try {
    const response = await fetch("/brands/" + brandId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
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
      title: "Brand deleted",
      text: "Brand deleted successfully.",
      icon: "success",
    }).then(() => {
      location.reload();
    });
  } catch (error) {
    console.error("Brand could not be deleted: ", error);
  }
}
