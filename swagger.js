const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    version: "1.0.0",
    title: "Exam Project API",
    description: "Documentation for the Exam Project API",
  },
  host: "localhost:3000",
  definitions: {
    Brand: {
      $brand: "Oculus VR",
    },
    Cart: {
      $productId: "1",
      $quantity: "1",
    },
    CartDelete: {
      $productId: "1",
    },
    Category: {
      $category: "VR Headsets",
    },
    Membership: {
      $membership: "Platinum",
      $purchases: "50",
      $discount: "50",
    },
    Order: {
      $statusId: "1",
    },
    Product: {
      $name: "Oculus Rift",
      $description: "A VR Headset",
      $imgUrl:
        "https://www.elkjop.no/image/dv_web_D180001002132666/OCULUSRIFT/oculus-rift-vr-headset.jpg",
      $unitPrice: "699",
      $quantity: "10",
      $categoryId: "1",
      $brandId: "1",
    },
    ProductEdit: {
      $name: "Oculus Rift",
      $description: "A VR Headset",
      $imgUrl:
        "https://www.elkjop.no/image/dv_web_D180001002132666/OCULUSRIFT/oculus-rift-vr-headset.jpg",
      $unitPrice: "699",
      $quantity: "10",
      $categoryId: "1",
      $brandId: "1",
      $isDeleted: 0,
    },
    Role: {
      $role: "Guest",
    },
    Search: {
      $name: "iPhone",
      $category: "Phones",
      $brand: "Apple",
    },
    Status: {
      $status: "On Hold",
    },
    UserLogin: {
      $userName: "Admin",
      $password: "P@ssword2023",
    },
    UserRegister: {
      $firstName: "User",
      $lastName: "NumberOne",
      $userName: "User123",
      $email: "user123@noroff.no",
      $password: "P@ssword123",
      $address: "School",
      $telephoneNumber: "12345678",
    },
    UserEdit: {
      $firstName: "User",
      $lastName: "NumberTwo",
      $email: "user@noroff.no",
      $address: "School 123",
      $telephoneNumber: "12345678",
      $roleId: "1",
    },
  },
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require("./bin/www");
});
