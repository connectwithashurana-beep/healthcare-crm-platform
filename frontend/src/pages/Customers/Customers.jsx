import { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AddCustomerModal from "../../components/AddCustomerModal/AddCustomerModal";
import "./Customers.css";
import { saveAs } from "file-saver";
import Papa from "papaparse";

import {
  fetchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer as deleteCustomerApi,
} from "../../services/customerService";

const statusOptions = ["Lead", "Customer", "Inactive"];

function Customers() {
  const [customers, setCustomers] = useState([]);

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 3;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  // =========================
  // LOAD CUSTOMERS
  // =========================

  const loadCustomers = async () => {
    setLoading(true);
    setError("");

    try {
      const responseData = await fetchCustomers();

      console.log("[Customers] fetchCustomers returned:", responseData);

      const normalized = Array.isArray(responseData)
        ? responseData
        : Array.isArray(responseData?.results)
        ? responseData.results
        : Array.isArray(responseData?.data)
        ? responseData.data
        : Array.isArray(responseData?.data?.results)
        ? responseData.data.results
        : [];

      console.log(
        "[Customers] normalized customers count:",
        normalized.length
      );

      setCustomers(normalized);
    } catch (err) {
      console.error("Fetch customers error:", err);
      setError("Unable to load customers. Please try again later.");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SEARCH
  // =========================

  const safeCustomers = Array.isArray(customers) ? customers : [];

  const filteredCustomers = safeCustomers.filter((customer) => {
    const fullName =
      `${customer.first_name || ""} ${customer.last_name || ""}`.trim();

    const query = search.toLowerCase();

    return (
      fullName.toLowerCase().includes(query) ||
      (customer.company || "").toLowerCase().includes(query) ||
      (customer.city || "").toLowerCase().includes(query) ||
      (customer.phone || "").toLowerCase().includes(query) ||
      (customer.email || "").toLowerCase().includes(query) ||
      (customer.status || "").toLowerCase().includes(query)
    );
  });

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.ceil(
    filteredCustomers.length / customersPerPage
  );

  const lastCustomer = currentPage * customersPerPage;
  const firstCustomer = lastCustomer - customersPerPage;

  const currentCustomers = filteredCustomers.slice(
    firstCustomer,
    lastCustomer
  );

  // =========================
  // ADD CUSTOMER
  // =========================

  const handleCreateCustomer = async (customerData) => {
    setError("");

    try {
      const payload = {
        first_name: (customerData.first_name || "").trim(),
        last_name: (customerData.last_name || "").trim(),
        email: (customerData.email || "").trim(),
        phone: (customerData.phone || "").trim(),
        company: (customerData.company || "").trim(),
        city: (customerData.city || "").trim(),
        state: (customerData.state || "").trim(),
        country: (customerData.country || "").trim(),
        status: customerData.status || "Lead",
      };

      const createdCustomer = await createCustomer(payload);

      console.log("[Customers] createdCustomer:", createdCustomer);

      setCustomers((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        return [createdCustomer, ...safePrev];
      });

      setCurrentPage(1);
      setIsModalOpen(false);
      setIsEditing(false);
      setEditingCustomer(null);
    } catch (err) {
      console.error("Create customer error:", err);
      setError(
        "Unable to save customer. Please verify the form and try again."
      );
    }
  };

  // =========================
  // UPDATE CUSTOMER
  // =========================

  const handleUpdateCustomer = async (id, customerData) => {
    setError("");

    try {
      const payload = {
        first_name: (customerData.first_name || "").trim(),
        last_name: (customerData.last_name || "").trim(),
        email: (customerData.email || "").trim(),
        phone: (customerData.phone || "").trim(),
        company: (customerData.company || "").trim(),
        city: (customerData.city || "").trim(),
        state: (customerData.state || "").trim(),
        country: (customerData.country || "").trim(),
        status: customerData.status || "Lead",
      };

      const updatedCustomer = await updateCustomer(id, payload);

      console.log("[Customers] updatedCustomer:", updatedCustomer);

      setCustomers((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];

        return safePrev.map((customer) =>
          customer.id === id ? updatedCustomer : customer
        );
      });

      setIsModalOpen(false);
      setIsEditing(false);
      setEditingCustomer(null);
    } catch (err) {
      console.error("Update customer error:", err);
      setError("Unable to update customer. Please try again.");
    }
  };

  // =========================
  // SAVE CUSTOMER
  // =========================

  const handleSaveCustomer = async (customerData) => {
    if (isEditing && editingCustomer) {
      await handleUpdateCustomer(editingCustomer.id, customerData);
    } else {
      await handleCreateCustomer(customerData);
    }
  };

  // =========================
  // DELETE CUSTOMER
  // =========================

  const handleDeleteCustomer = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmed) {
      return;
    }

    setError("");

    const previousCustomers = [...safeCustomers];

    // Remove immediately from UI
    setCustomers((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return safePrev.filter((customer) => customer.id !== id);
    });

    try {
      await deleteCustomerApi(id);

      // Fix page if last item was deleted
      setCurrentPage((page) => {
        const remainingCustomers = previousCustomers.filter(
          (customer) => customer.id !== id
        );

        const remainingPages = Math.max(
          1,
          Math.ceil(remainingCustomers.length / customersPerPage)
        );

        return Math.min(page, remainingPages);
      });
    } catch (err) {
      console.error("Delete customer error:", err);

      setError("Unable to delete customer. Please try again.");

      // Restore data if API fails
      setCustomers(previousCustomers);
    }
  };

  // =========================
  // EDIT CUSTOMER
  // =========================

  const editCustomer = (customer) => {
    setEditingCustomer(customer);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // =========================
  // VIEW CUSTOMER
  // =========================

  const viewCustomer = (customer) => {
    setViewingCustomer(customer);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewingCustomer(null);
    setIsViewModalOpen(false);
  };

  // =========================
  // EXPORT CSV
  // =========================

  const exportCSV = () => {
    const headers = [
      "Name",
      "Company",
      "City",
      "Phone",
      "Email",
      "Status",
    ];

    const rows = filteredCustomers.map((customer) => [
      `${customer.first_name || ""} ${customer.last_name || ""}`.trim(),
      customer.company || "",
      customer.city || "",
      customer.phone || "",
      customer.email || "",
      customer.status || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    saveAs(blob, "customers.csv");
  };

  // =========================
  // IMPORT CSV
  // =========================

  const importCSV = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,

      complete: (results) => {
        const importedCustomers = results.data
          .map((row) => {
            const rawName = row.Name || row.name || "";

            const nameParts = rawName.trim().split(" ");

            const first_name = nameParts.shift() || "";
            const last_name = nameParts.join(" ");

            if (!first_name) {
              return null;
            }

            return {
              id: `import-${Date.now()}-${Math.random()}`,

              first_name,
              last_name,

              company: row.Company || row.company || "",
              city: row.City || row.city || "",
              state: row.State || row.state || "",
              country: row.Country || row.country || "",

              phone: row.Phone || row.phone || "",
              email: row.Email || row.email || "",

              status: row.Status || row.status || "Lead",
            };
          })
          .filter(Boolean);

        setCustomers((prevCustomers) => [
          ...importedCustomers,
          ...(Array.isArray(prevCustomers) ? prevCustomers : []),
        ]);

        setCurrentPage(1);

        alert("Customers imported successfully.");

        // Reset input so same file can be selected again
        event.target.value = "";
      },

      error: (parseError) => {
        console.error("Import CSV error:", parseError);
        setError("Unable to process CSV file.");
      },
    });
  };
    // =========================
  // RENDER
  // =========================

  return (
    <Layout>
      <div className="customers-page">

        {/* ================= HEADER ================= */}

        <div className="customers-header">
          <div>
            <h2>Customers</h2>

            <p className="customers-subtitle">
              Manage customer profiles and sales relationships.
            </p>
          </div>

          <div className="customer-actions">

            <button
              className="add-btn"
              onClick={() => {
                setIsEditing(false);
                setEditingCustomer(null);
                setIsModalOpen(true);
              }}
            >
              + Add Customer
            </button>

            <button
              className="export-btn"
              onClick={exportCSV}
            >
              Export CSV
            </button>

            <label className="import-btn">
              Import CSV

              <input
                type="file"
                accept=".csv"
                onChange={importCSV}
                hidden
              />
            </label>

          </div>
        </div>

        {/* ================= SEARCH ================= */}

        <div className="customers-toolbar">

          <input
            className="search-box"
            type="text"
            placeholder="Search by name, company, city, email, status..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />

        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        {/* ================= LOADING ================= */}

        {loading ? (

          <div className="loading-state">
            Loading customers...
          </div>

        ) : (

          <>

            {/* ================= TABLE ================= */}

            <table className="customer-table">

              <thead>
                <tr>
                  <th>Name</th>
                  <th>Company</th>
                  <th>City</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {currentCustomers.length > 0 ? (

                  currentCustomers.map((customer) => (

                    <tr key={customer.id}>

                      {/* NAME */}

                      <td>
                        {`${customer.first_name || ""} ${
                          customer.last_name || ""
                        }`.trim() || "—"}
                      </td>

                      {/* COMPANY */}

                      <td>
                        {customer.company || "—"}
                      </td>

                      {/* CITY */}

                      <td>
                        {customer.city || "—"}
                      </td>

                      {/* PHONE */}

                      <td>
                        {customer.phone || "—"}
                      </td>

                      {/* EMAIL */}

                      <td>
                        {customer.email || "—"}
                      </td>

                      {/* STATUS */}

                      <td>
                        <span
                          className={`status-badge status-${(
                            customer.status || "Lead"
                          ).toLowerCase()}`}
                        >
                          {customer.status || "Lead"}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td className="action-buttons">

                        <button
                          type="button"
                          className="view-btn"
                          onClick={() => viewCustomer(customer)}
                        >
                          View
                        </button>

                        <button
                          type="button"
                          className="edit-btn"
                          onClick={() => editCustomer(customer)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() =>
                            handleDeleteCustomer(customer.id)
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      className="empty-row"
                      colSpan="7"
                    >
                      {search
                        ? "No customers found for your search."
                        : "No customers found."}
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

            {/* ================= PAGINATION ================= */}

            {filteredCustomers.length > 0 && (
              <div className="pagination">

                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.max(page - 1, 1)
                    )
                  }
                >
                  Previous
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => (
                    <button
                      type="button"
                      key={index}
                      className={
                        currentPage === index + 1
                          ? "active-page"
                          : ""
                      }
                      onClick={() =>
                        setCurrentPage(index + 1)
                      }
                    >
                      {index + 1}
                    </button>
                  )
                )}

                <button
                  type="button"
                  disabled={
                    currentPage === totalPages ||
                    totalPages === 0
                  }
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(page + 1, totalPages)
                    )
                  }
                >
                  Next
                </button>

              </div>
            )}

            {/* ================= ADD / EDIT MODAL ================= */}

            <AddCustomerModal
              isOpen={isModalOpen}

              closeModal={() => {
                setIsModalOpen(false);
                setIsEditing(false);
                setEditingCustomer(null);
              }}

              onSave={handleSaveCustomer}

              editingCustomer={editingCustomer}

              isEditing={isEditing}

              statusOptions={statusOptions}
            />

            {/* ================= VIEW MODAL ================= */}

            {isViewModalOpen && viewingCustomer && (

              <div
                className="view-modal-overlay"
                onClick={closeViewModal}
              >

                <div
                  className="view-modal"
                  onClick={(e) => e.stopPropagation()}
                >

                  <div className="view-modal-header">

                    <div>
                      <h3>Customer Details</h3>

                      <p>
                        View customer information
                      </p>
                    </div>

                    <button
                      type="button"
                      className="view-modal-close"
                      onClick={closeViewModal}
                    >
                      ×
                    </button>

                  </div>

                  <div className="customer-details">

                    <div className="detail-item">
                      <span>Name</span>
                      <strong>
                        {`${viewingCustomer.first_name || ""} ${
                          viewingCustomer.last_name || ""
                        }`.trim() || "—"}
                      </strong>
                    </div>

                    <div className="detail-item">
                      <span>Email</span>
                      <strong>
                        {viewingCustomer.email || "—"}
                      </strong>
                    </div>

                    <div className="detail-item">
                      <span>Phone</span>
                      <strong>
                        {viewingCustomer.phone || "—"}
                      </strong>
                    </div>

                    <div className="detail-item">
                      <span>Company</span>
                      <strong>
                        {viewingCustomer.company || "—"}
                      </strong>
                    </div>

                    <div className="detail-item">
                      <span>City</span>
                      <strong>
                        {viewingCustomer.city || "—"}
                      </strong>
                    </div>

                    <div className="detail-item">
                      <span>State</span>
                      <strong>
                        {viewingCustomer.state || "—"}
                      </strong>
                    </div>

                    <div className="detail-item">
                      <span>Country</span>
                      <strong>
                        {viewingCustomer.country || "—"}
                      </strong>
                    </div>

                    <div className="detail-item">
                      <span>Status</span>

                      <strong>
                        <span
                          className={`status-badge status-${(
                            viewingCustomer.status || "Lead"
                          ).toLowerCase()}`}
                        >
                          {viewingCustomer.status || "Lead"}
                        </span>
                      </strong>
                    </div>

                  </div>

                  <div className="view-modal-footer">

                    <button
                      type="button"
                      className="edit-btn"
                      onClick={() => {
                        closeViewModal();
                        editCustomer(viewingCustomer);
                      }}
                    >
                      Edit Customer
                    </button>

                    <button
                      type="button"
                      className="view-close-btn"
                      onClick={closeViewModal}
                    >
                      Close
                    </button>

                  </div>

                </div>

              </div>

            )}

          </>

        )}

      </div>
    </Layout>
  );
}

export default Customers;