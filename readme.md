# Course Assignment Information

Grade: A (90-100)

This is the Exam Project I got at the end of my second semester. The task was to create the back-end system for an e-commerce site with static data using API and MySQL, as well as create an Admin front-end user interface.

The *Initial Commit* is the original code I got for the assignment.

The *Final Commit* is my finished code that I sent in for the assignment.

# Application Installation and Usage Instructions

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/noroff-backend-1/aug23ft-ep-ca-1-ArielHalsvik
   ```

2. **Open the Terminal:**

   ```bash
   npm install
   ```

3. **Create an .env file:**

   - Create an .env file.
   - Paste in the text from _Environment Variables_ down below.

4. **Create the Database:**

   - Open the mySQL application.
   - Paste the text below into mySQL and run it.

   ```bash
   CREATE DATABASE examProject;
   ```

5. **Create a user:**

   - Paste the text from below into mySQL and run it.

   ```bash
   CREATE USER 'adminUser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'p4ssw0rd';
   ```

   ```bash
   GRANT ALL PRIVILEGES ON examProject.* TO 'adminUser'@'localhost';
   ```

6. **Open the terminal again:**
   ```bash
   npm start
   ```
7. **Fill database:**

   - Go to http://localhost:3000/doc in a web browser and find 'POST /init/' under 'Utilities', or use Postman to POST to http://localhost:3000/init to fill database.

8. **Open the Application and test it:**

   - You can test the application on the http://localhost:3000/doc webpage, or use Postman.
   - You can also login to the Admin user interface on http://localhost:3000/admin/login. Username: Admin, Password: P@ssword2023.

9. **Test the program**
   - Cancel npm start and paste this:

   ```bash
   npm test
   ```

# Environment Variables

The following environment variables are required to run the application:

HOST = "localhost" <br>
ADMIN_USERNAME = "adminUser" <br>
ADMIN_PASSWORD = "p4ssw0rd" <br>
DATABASE_NAME = "examProject" <br>
DIALECT = "mysql" <br>
DIALECTMODEL = "mysql2" <br>
PORT = "3000" <br>
TOKEN_SECRET = b8dd5f6c3d52a074ad112e8b08bf7faff6501e0a3da42884b38999f8241adb68196ba1e6958bb2b613a181c50d6b18c33ae0664a82ff70af0a5e39d76949f9b6 <br>

# References

### Used Developer Mozilla to fetch the API:

To fetch the backend REST API and to check if the response came through.

https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

```sh
  const response = await fetch(
    "http://backend.restapi.co.za/items/products"
  );

  if (!response.ok) {
    return errorMessage(res, "Products could not be fetched from the API.");
  }

  const responseData = await response.json();
  if (!responseData) {
    return errorMessage(res, "No JSON data returned from the API.");
  }

  const data = responseData.data;
```

### Used Sequelize to use findOrCreate:

So that the code wouldn't duplicate brands and categories when fetching the data from the API.

https://sequelize.org/docs/v6/core-concepts/model-querying-finders/

```sh
  const [brand] = await db.Brand.findOrCreate({
    where: { Brand: item.brand },
  });

  const [category] = await db.Category.findOrCreate({
    where: { Category: item.category },
  });
```

### Order number generator:

Used ChatGPT to help as well as searching through the curriculum to create this function.
It creates an 8 character long string based on the character variable below.

```sh
  function generateOrderNumber() {
    const characters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let orderNumber = "";
    for (let i = 0; i < 8; i++) {
      orderNumber += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return orderNumber;
  }
```

### Used GeeksForGeeks to use GROUP_CONCAT:

To get all products collected so that an order can be presented with the orderitems.

https://www.geeksforgeeks.org/mysql-group_concat-function/

```sh
  GROUP_CONCAT(DISTINCT p.Name SEPARATOR ', ') AS Products
```

### Used Bootstrap to style the admin user interface:

I've used multiple different pages within this link to reference different ways to style etc.

https://getbootstrap.com/docs/5.3/getting-started/introduction/

### Used SweetAlert for all alerts on the admin user interface:

https://sweetalert2.github.io/

### Used W3Schools to create a dropdown menu:

I used the format of label, select and option, instead of having the admin write in the brand and category into an input.

https://www.w3schools.com/html/html_form_elements.asp

```sh
  <div class="me-4">
    <label for="category" class="form-label">Category</label>
    <select id="searchCategory" name="category" class="form-select">
      <option value="">None</option>
      <% categories.forEach((category) => { %>
      <option value="<%= category.Category %>">
        <%= category.Category %>
      </option>
      <% }); %>
    </select>
  </div>
```

### Used ChatGPT for role selection:

Used ChatGPT to help format the Swal.fire edit pop-up, so that the current role will be shown as selected.
I've used this format other places too, such as for brands and categories.
It maps through the roles data, and if the name of the role matches the currentRole of the user, then it puts a selected on it so that that role is selected.
If not, it just gets added to the options of the select options.

```sh
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
```

### Used Developer Mozilla for using fetch between client-side and server-side:

Used multiple places on /public/js files, to send requests to the back-end side, before checking if the response went through.

https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

```sh
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
```

### Used W3Schools to format all timestamps:

This is to make it appear nicer to the eyes and not have the timezone stamped on the front-end.

https://www.w3schools.com/sql/func_mysql_date_format.asp

```sh
  DATE_FORMAT(p.createdAt, '%Y-%M-%d %H:%i:%s') AS createdAt,
  DATE_FORMAT(p.updatedAt, '%Y-%M-%d %H:%i:%s') AS updatedAt
```

### Used Dev.to to setup Cookies with JWT:

The code saves the JWT token inside the user's cookies so that it can easily be collected and read by a middleware.
The second part of the code grabs the token from the cookies.

https://dev.to/vishalshinde/login-and-sign-up-auth-using-jwt-5c2f

```sh
  res.cookie("token", token, { httpOnly: true, secure: true });

  token = req.cookies.token;
```

### Used ChatGPT to use req.method and req.url:

Used multiple places inside the middleware folder, to better target the part of the code that should be checked below this criteria.

```sh
  if (req.method === "POST" && req.url === "/checkout/now")
```

### Used W3Schools to use SUM():

To get a SUM of all items quantity, instead of just a COUNT of all individual products.

https://www.w3schools.com/sql/func_mysql_sum.asp.

```sh
  async getAllOrderItemsTotal(userId) {
    try {
      let data = await this.client.query(
        `
          SELECT SUM(Quantity) AS total
          FROM orderitems i
          LEFT JOIN orders o ON i.OrderId = o.OrderId
          WHERE o.UserId = ${userId}
        `,
        {
          raw: true,
          type: sequelize.QueryTypes.SELECT,
        }
      );
      return data[0].total;
    } catch (error) {
      console.error(error);
    }
  }
```

# Additional Libraries/Packages

This program was made using Express.

Additional libraries/packages were used in this project.

**Cookie Parser**

- https://github.com/expressjs/cookie-parser/tree/master

**Crypto**

- https://www.npmjs.com/package/crypto

**Dotenv**

- https://github.com/motdotla/dotenv

**EJS**

- https://ejs.co/

**Express JS**

- https://expressjs.com/

**Jest**

- https://jestjs.io/

**JSON Web Token**

- https://github.com/auth0/node-jsonwebtoken#readme

**MySQL**

- https://github.com/mysqljs/mysql

**MySQL2**

- https://github.com/sidorares/node-mysql2

**Sequelize**

- https://sequelize.org/

**SuperTest**

- https://github.com/ladjs/supertest#readme

**Swagger Autogen**

- https://swagger-autogen.github.io/docs/

**Swagger UI Express**

- https://github.com/scottie1984/swagger-ui-express

# NodeJS Version Used

NodeJS v20.10.0

# Additional Documentation

Please refer to the [Reflection_Report.pdf](Documentation/Reflection_Report.pdf) for a reflection of this exam project.
