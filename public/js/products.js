/* Add Product */
async function addProduct(brands, categories) {
  const brandsData = JSON.parse(brands);
  const categoriesData = JSON.parse(categories);

  const brandOptions = brandsData
    .map((brand) => `<option value="${brand.BrandId}">${brand.Brand}</option>`)
    .join("");

  const categoryOptions = categoriesData
    .map(
      (category) =>
        `<option value="${category.CategoryId}">${category.Category}</option>`
    )
    .join("");

  Swal.fire({
    title: "Add product",
    html: `
      <div>
        <label for="name" class="form-label">Name</label>
        <input id="nameInput" name="name" class="form-control" type="text">

        <label for="Brand" class="form-label">Brand</label>
        <select id="brandSelect" class="form-select">${brandOptions}</select>
        
        <label for="Category" class="form-label">Category</label>
        <select id="categorySelect" class="form-select">${categoryOptions}</select>

        <label for="description" class="form-label">Description</label>
        <input id="descriptionInput" name="description" class="form-control" type="text">
        
        <label for="quantity" class="form-label">Quantity</label>
        <input id="quantityInput" name="quantity" class="form-control" type="number">

        <label for="unitPrice" class="form-label">Unit Price</label>
        <input id="unitPriceInput" name="unitPrice" class="form-control" type="number">
        
        <label for="imgUrl" class="form-label">Image URL</label>
        <input id="imgUrlInput" name="imgUrl" class="form-control" type="text">
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Save changes",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch("/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: nameInput.value,
            description: descriptionInput.value,
            imgUrl: imgUrlInput.value,
            unitPrice: unitPriceInput.value,
            quantity: quantityInput.value,
            categoryId: categorySelect.value,
            brandId: brandSelect.value,
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
          title: "Product added",
          text: "Product added successfully.",
          icon: "success",
        }).then(() => {
          location.reload();
        });
      } catch (error) {
        console.error("Product could not be added: ", error);
      }
    }
  });
}

/* Edit Product */
async function editProduct(
  brands,
  categories,
  productId,
  name,
  description,
  quantity,
  unitPrice,
  currentBrand,
  currentCategory,
  imgUrl,
  isDeleted
) {
  let checkBox;
  if (isDeleted == 1) {
    checkBox = "checked";
  } else {
    checkBox = "";
  }

  const brandsData = JSON.parse(brands);
  const categoriesData = JSON.parse(categories);

  const brandOptions = brandsData
    .map((brand) => {
      if (brand.Brand === currentBrand) {
        return `<option value="${brand.BrandId}" selected>${brand.Brand}</option>`;
      } else {
        return `<option value="${brand.BrandId}">${brand.Brand}</option>`;
      }
    })
    .join("");

  const categoryOptions = categoriesData
    .map((category) => {
      if (category.Category === currentCategory) {
        return `<option value="${category.CategoryId}" selected>${category.Category}</option>`;
      } else {
        return `<option value="${category.CategoryId}">${category.Category}</option>`;
      }
    })
    .join("");

  Swal.fire({
    title: "Edit product details",
    html: `
      <div>
        <label for="productId" class="form-label">Product ID</label>
        <input name="productId" class="form-control" type="text" value="${productId}" disabled>

        <label for="name" class="form-label">Name</label>
        <input id="nameInput" name="name" class="form-control" type="text" value="${name}">
            
        <label for="Brand" class="form-label">Brand</label>
        <select id="brandSelect" class="form-select">${brandOptions}</select>
        
        <label for="Category" class="form-label">Category</label>
        <select id="categorySelect" class="form-select">${categoryOptions}</select>

        <label for="description" class="form-label">Description</label>
        <input id="descriptionInput" name="description" class="form-control" type="text" value="${description}">
        
        <label for="quantity" class="form-label">Quantity</label>
        <input id="quantityInput" name="quantity" class="form-control" type="number" value="${quantity}">

        <label for="unitPrice" class="form-label">Unit Price</label>
        <input id="unitPriceInput" name="unitPrice" class="form-control" type="number" value="${unitPrice}">
        
        <label for="imgUrl" class="form-label">Image URL</label>
        <input id="imgUrlInput" name="imgUrl" class="form-control" type="text" value="${imgUrl}">

        <div class="form-check form-switch">
          <label for="isDeleted" class="form-check-label">isDeleted</label>
          <input id="isDeletedInput" name="isDeleted" class="form-check-input" type="checkbox" ${checkBox}>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Save changes",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch("/products/" + productId, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: nameInput.value,
            description: descriptionInput.value,
            imgUrl: imgUrlInput.value,
            unitPrice: unitPriceInput.value,
            quantity: quantityInput.value,
            categoryId: categorySelect.value,
            brandId: brandSelect.value,
            isDeleted: isDeletedInput.checked ? 1 : 0,
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
          text: "Product details updated successfully.",
          icon: "success",
        }).then(() => {
          location.reload();
        });
      } catch (error) {
        console.error("Product could not be updated: ", error);
      }
    }
  });
}

/* Delete Product */
async function deleteProduct(productId) {
  try {
    const response = await fetch("/products/" + productId, {
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
      title: "Product deleted",
      text: "Product deleted successfully.",
      icon: "success",
    }).then(() => {
      location.reload();
    });
  } catch (error) {
    console.error("Product could not be deleted: ", error);
  }
}
