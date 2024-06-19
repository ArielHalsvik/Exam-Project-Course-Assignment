var express = require("express");
var app = express();
var request = require("supertest");
var bodyParser = require("body-parser");
var jwt = require("jsonwebtoken");

var categoriesRouter = require("../routes/categories");
var productsRouter = require("../routes/products");
var brandsRouter = require("../routes/brands");
app.use(bodyParser.json());
app.use("/categories", categoriesRouter);
app.use("/products", productsRouter);
app.use("/brands", brandsRouter);

function testJWT() {
  return jwt.sign({ roleId: 1 }, process.env.TOKEN_SECRET, {
    expiresIn: "2h",
  });
}

let token = testJWT();
let categoryId;
let productId;
let brandId;

describe("creating test brand", () => {
  test("POST /brands - success", async () => {
    const newBrand = {
      brand: "TEST_BRAND",
    };

    const { body } = await request(app)
      .post("/brands")
      .set("Authorization", `Bearer ${token}`)
      .send(newBrand);

    expect(body.statusCode).toBe(200);
    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("result");
    expect(body.data.result).toBe("Brand created successfully.");
    brandId = body.data.brand.BrandId;
  });
});

describe("testing categories and products routes", () => {
  /* Get all Categories */
  test("GET /categories - success", async () => {
    const { body } = await request(app).get("/categories");

    expect(body.statusCode).toBe(200);
    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("result");
    expect(body.data.result).toBe("Categories found successfully.");
  });

  /* Create a Category */
  test("POST /categories - success", async () => {
    const newCategory = {
      category: "TEST_CATEGORY",
    };

    const { body } = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${token}`)
      .send(newCategory);

    expect(body.statusCode).toBe(200);
    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("result");
    expect(body.data.result).toBe("Category created successfully.");
    categoryId = body.data.category.CategoryId;
  });

  /* Get all Products */
  test("GET /products - success", async () => {
    const { body } = await request(app).get("/products");

    expect(body.statusCode).toBe(200);
    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("result");
    expect(body.data.result).toBe("Products found successfully.");
  });

  /* Create a Product */
  test("POST /products - success", async () => {
    const newProduct = {
      name: "TEST_PRODUCT",
      description: "TEST_DESCRIPTION",
      imgUrl: "http://TEST_URL/products.png",
      unitPrice: 100,
      quantity: 10,
      categoryId: categoryId,
      brandId: brandId,
    };

    const { body } = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send(newProduct);

    expect(body.statusCode).toBe(200);
    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("result");
    expect(body.data.result).toBe("Product created successfully.");
    productId = body.data.product.ProductId;
  });

  /* Change a Product */
  test("PUT /products - success", async () => {
    const updatedProduct = {
      name: "UPDATED_PRODUCT",
      description: "UPDATED_DESCRIPTION",
      imgUrl: "http://UPDATED_URL/products.png",
      unitPrice: 200,
      quantity: 20,
      categoryId: categoryId,
      brandId: brandId,
      isDeleted: 0,
    };

    const { body } = await request(app)
      .put(`/products/${productId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedProduct);

    expect(body.statusCode).toBe(200);
    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("result");
    expect(body.data.result).toBe("Product updated successfully.");
  });

  /* Change a Category */
  test("PUT /categories - success", async () => {
    const updatedCategory = {
      category: "UPDATED_CATEGORY",
    };

    const { body } = await request(app)
      .put(`/categories/${categoryId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedCategory);

    expect(body.statusCode).toBe(200);
    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("result");
    expect(body.data.result).toBe("Category updated successfully.");
  });

  /* Delete a Product */
  test("DELETE /products - success", async () => {
    const { body } = await request(app)
      .delete(`/products/${productId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(body.statusCode).toBe(200);
    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("result");
    expect(body.data.result).toBe("Product deleted successfully.");
  });

  /* Delete a Category */
  test("DELETE /categories - fail", async () => {
    const { body } = await request(app)
      .delete(`/categories/${categoryId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(body.statusCode).toBe(500);
    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("result");
    expect(body.data.result).toBe("Category is in use and cannot be deleted.");
  });
});
