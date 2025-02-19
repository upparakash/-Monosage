import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext
import "./dashboard.css";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext); // Get logged-in user from context
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:5000/api/user/${user.id}`) // Fetch only logged-in user
        .then((res) => {
          setUserData(res.data);
          setFormData({ name: res.data.name, email: res.data.email });
        })
        .catch((err) => console.error("Error fetching user:", err));
    }
  }, [user]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle user update
  const handleUpdate = () => {
    axios
      .put(`http://localhost:5000/api/user/${user.id}`, formData)
      .then((res) => {
        setUserData(res.data);
        setEditMode(false);
        alert("Profile updated successfully!");
      })
      .catch((err) => console.error("Error updating user:", err));
  };

  // Handle user deletion
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      axios
        .delete(`http://localhost:5000/api/user/${user.id}`)
        .then(() => {
          alert("Account deleted successfully!");
          logout();
          window.location.href = "/"; // Redirect to login after deletion
        })
        .catch((err) => console.error("Error deleting user:", err));
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    window.location.href = "/"; // Redirect to login page after logout
  };

  return (
    <div className="container">
      <h2>My Profile</h2>
      <button className="btn btn-primary logout-btn" onClick={handleLogout}>
        Logout
      </button>
      {userData ? (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {editMode ? (
                  <input type="text" name="name" value={formData.name} onChange={handleChange} />
                ) : (
                  userData.name
                )}
              </td>
              <td>
                {editMode ? (
                  <input type="email" name="email" value={formData.email} onChange={handleChange} />
                ) : (
                  userData.email
                )}
              </td>
              <td>
                {editMode ? (
                  <button className="btn btn-success" onClick={handleUpdate}>
                    Save
                  </button>
                ) : (
                  <button className="btn btn-warning" onClick={() => setEditMode(true)}>
                    Edit
                  </button>
                )}
                <button className="btn btn-danger" onClick={handleDelete}>
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Dashboard;
