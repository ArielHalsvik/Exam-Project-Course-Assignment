/* Edit Order */
async function editOrder(statuses, orderId, currentStatus) {
  const data = JSON.parse(statuses);

  const statusOptions = data
    .map((status) => {
      if (status.Status === currentStatus) {
        return `<option value="${status.StatusId}" selected>${status.Status}</option>`;
      } else {
        return `<option value="${status.StatusId}">${status.Status}</option>`;
      }
    })
    .join("");

  Swal.fire({
    title: "Edit order details",
    html: `
            <div>
              <label for="orderId" class="form-label">Order ID</label>
              <input name="orderId" class="form-control" type="number" value="${orderId}" disabled>
      
              <label for="order" class="form-label">Order</label>
              <select id="orderSelect" class="form-select">${statusOptions}</select>
            </div>
          `,
    showCancelButton: true,
    confirmButtonText: "Save changes",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch("/orders/" + orderId, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            statusId: orderSelect.value,
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
          text: "Order status updated successfully.",
          icon: "success",
        }).then(() => {
          location.reload();
        });
      } catch (error) {
        console.error("Order status could not be updated: ", error);
      }
    }
  });
}
