/* Add Category */
async function addCategory() {
  Swal.fire({
    title: "Add category",
    html: `
            <div>
              <label for="category" class="form-label">Category</label>
              <input id="categoryInput" name="name" class="form-control" type="text">
            </div>
          `,
    showCancelButton: true,
    confirmButtonText: "Save changes",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch("/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category: categoryInput.value,
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
          title: "Category added",
          text: "Category added successfully.",
          icon: "success",
        }).then(() => {
          location.reload();
        });
      } catch (error) {
        console.error("Category could not be added: ", error);
      }
    }
  });
}

/* Edit Category */
async function editCategory(categoryId, category) {
  Swal.fire({
    title: "Edit category details",
    html: `
            <div>
              <label for="categoryId" class="form-label">Category ID</label>
              <input name="categoryId" class="form-control" type="number" value="${categoryId}" disabled>
      
              <label for="category" class="form-label">Category</label>
              <input id="categoryInput" name="name" class="form-control" type="text" value="${category}">
            </div>
          `,
    showCancelButton: true,
    confirmButtonText: "Save changes",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch("/categories/" + categoryId, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category: categoryInput.value,
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
          text: "Category details updated successfully.",
          icon: "success",
        }).then(() => {
          location.reload();
        });
      } catch (error) {
        console.error("Category could not be updated: ", error);
      }
    }
  });
}

/* Delete Category */
async function deleteCategory(categoryId) {
  try {
    const response = await fetch("/categories/" + categoryId, {
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
      title: "Category deleted",
      text: "Category deleted successfully.",
      icon: "success",
    }).then(() => {
      location.reload();
    });
  } catch (error) {
    console.error("Category could not be deleted: ", error);
  }
}
