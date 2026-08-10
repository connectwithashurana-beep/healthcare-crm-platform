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
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 6;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

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
      console.log("[Customers] normalized customers count:", normalized.length);
      setCustomers(normalized);
    } catch (err) {
      console.error("Fetch customers error:", err);
      setError("Unable to load customers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const safeCustomers = Array.isArray(customers) ? customers : [];
  const filteredCustomers = safeCustomers.filter((customer) => {
    const fullName = `${customer.first_name || ""} ${customer.last_name || ""}`.trim();
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

  const lastCustomer = currentPage * customersPerPage;
  const firstCustomer = lastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(firstCustomer, lastCustomer);
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  const handleCreateCustomer = async (customerData) => {
    setError("");

    try {
      const payload = {
        first_name: customerData.first_name.trim(),
        last_name: customerData.last_name.trim(),
        email: customerData.email.trim(),
        phone: customerData.phone.trim(),
        company: customerData.company.trim(),
        city: customerData.city.trim(),
        state: customerData.state.trim(),
        country: customerData.country.trim(),
        status: customerData.status,
      };

      const createdCustomer = await createCustomer(payload);
      console.log("[Customers] createdCustomer:", createdCustomer);
      setCustomers((prev) => [createdCustomer, ...prev]);
      setIsModalOpen(false);
      setIsEditing(false);
      setEditingCustomer(null);
    } catch (err) {
      console.error("Create customer error:", err);
      setError("Unable to save customer. Please verify the form and try again.");
    }
  };

  const handleUpdateCustomer = async (id, customerData) => {
    setError("");

    try {
      const payload = {
        first_name: customerData.first_name.trim(),
        last_name: customerData.last_name.trim(),
        email: customerData.email.trim(),
        phone: customerData.phone.trim(),
        company: customerData.company.trim(),
        city: customerData.city.trim(),
        state: customerData.state.trim(),
        country: customerData.country.trim(),
        status: customerData.status,
      };

      const updatedCustomer = await updateCustomer(id, payload);
      console.log("[Customers] updatedCustomer:", updatedCustomer);
      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === id ? updatedCustomer : customer
        )
      );
      setIsModalOpen(false);
      setIsEditing(false);
      setEditingCustomer(null);
    } catch (err) {
      console.error("Update customer error:", err);
      setError("Unable to update customer. Please try again.");
    }
  };

  const handleSaveCustomer = async (customerData) => {
    if (isEditing && editingCustomer) {
      await handleUpdateCustomer(editingCustomer.id, customerData);
    } else {
      await handleCreateCustomer(customerData);
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) {
      return;
    }

    setError("");
    const previousCustomers = [...customers];
    setCustomers((prev) => prev.filter((customer) => customer.id !== id));

    try {
      await deleteCustomerApi(id);
    } catch (err) {
      console.error("Delete customer error:", err);
      setError("Unable to delete customer. Please try again.");
      setCustomers(previousCustomers);
    }
  };

  const editCustomer = (customer) => {
    setEditingCustomer(customer);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Export CSV
  const exportCSV = () => {
    const headers = ["Name", "Company", "City", "Phone", "Email", "Status"];
    const rows = filteredCustomers.map((customer) => [
      `${customer.first_name || ""} ${customer.last_name || ""}`.trim(),
      customer.company || "",
      customer.city || "",
      customer.phone || "",
      customer.email || "",
      customer.status || "",
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "customers.csv");
  };

  const importCSV = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const importedCustomers = results.data
          .map((row) => {
            const rawName = row.Name || row.name || "";
            const [first_name, ...lastParts] = rawName.trim().split(" ");
            if (!first_name) return null;
            return {
              id: Date.now() + Math.random(),
              first_name,
              last_name: lastParts.join(" ") || "",
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

        setCustomers((prevCustomers) => [...importedCustomers, ...prevCustomers]);
        setCurrentPage(1);
        alert("Customers imported successfully.");
      },
      error: (parseError) => {
        console.error("Import CSV error:", parseError);
        setError("Unable to process CSV file.");
      },
    });
  };

  return (
    <Layout>
      <div className="customers-page">
        <div className="customers-header">
          <div>
            <h2>Customers</h2>
            <p className="customers-subtitle">Manage customer profiles and sales relationships.</p>
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
            <button className="export-btn" onClick={exportCSV}>
              Export CSV
            </button>
            <label className="import-btn">
              Import CSV
              <input type="file" accept=".csv" onChange={importCSV} hidden />
            </label>
          </div>
        </div>

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

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <div className="loading-state">Loading customers...</div>
        ) : (
          <>
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
                      <td>{`${customer.first_name || ""} ${customer.last_name || ""}`.trim()}</td>
                      <td>{customer.company || "—"}</td>
                      <td>{customer.city || "—"}</td>
                      <td>{customer.phone || "—"}</td>
                      <td>{customer.email || "—"}</td>
                      <td>
                        <span className={`status-badge status-${(customer.status || "Lead").toLowerCase()}`}>
                          {customer.status || "Lead"}
                        </span>
                      </td>
                      <td className="action-buttons">
                        <button className="view-btn" onClick={() => editCustomer(customer)}>
                          Edit
                        </button>
                        <button className="delete-btn" onClick={() => handleDeleteCustomer(customer.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="empty-row" colSpan="7">
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}>
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={currentPage === index + 1 ? "active-page" : ""}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}>
                Next
              </button>
            </div>

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
          </>
        )}
      </div>
    </Layout>
  );
}

export default Customers;