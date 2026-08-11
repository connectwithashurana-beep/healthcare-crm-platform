const API_URL =
  "https://healthcare-crm-platform.onrender.com/api/customers/";

// GET CUSTOMERS
export const fetchCustomers = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch customers: ${response.status}`);
  }

  return await response.json();
};

// CREATE CUSTOMER
export const createCustomer = async (customerData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customerData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(errorText);
    throw new Error(`Failed to create customer: ${response.status}`);
  }

  return await response.json();
};

// UPDATE CUSTOMER
export const updateCustomer = async (id, customerData) => {
  const response = await fetch(`${API_URL}${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customerData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update customer: ${response.status}`);
  }

  return await response.json();
};

// DELETE CUSTOMER
export const deleteCustomer = async (id) => {
  const response = await fetch(`${API_URL}${id}/`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete customer: ${response.status}`);
  }

  return true;
};