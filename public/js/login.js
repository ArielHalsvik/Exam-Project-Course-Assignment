async function login() {
  const userName = document.getElementById("userName").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName, password }),
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      return Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage.data.result,
      });
    }

    const responseData = await response.json();
    const roleId = responseData.data.roleId;

    if (roleId !== 1) {
      return Swal.fire({
        icon: "error",
        title: "Error",
        text: "Access denied. Not an admin.",
      });
    } else {
      Swal.fire({
        title: "Login successful",
        text: "You've successfully logged in.",
        icon: "success",
      }).then(() => {
        window.location.href = "/admin/products";
      });
    }
  } catch (error) {
    console.error("Login failed:", error);
  }
}
