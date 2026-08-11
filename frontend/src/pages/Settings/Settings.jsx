import { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import "./Settings.css";

function Settings() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [password, setPassword] = useState({
    current: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  // Load saved profile
  useEffect(() => {
    const savedProfile = localStorage.getItem("crm_profile");

    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  // Update profile
  const handleProfileUpdate = (e) => {
    e.preventDefault();

    if (!profile.name || !profile.email) {
      setMessage("Please enter your name and email.");
      return;
    }

    localStorage.setItem("crm_profile", JSON.stringify(profile));

    setMessage("Profile updated successfully!");
  };

  // Change password validation
  const handlePasswordChange = (e) => {
    e.preventDefault();

    if (!password.current || !password.newPassword) {
      setMessage("Please fill all password fields.");
      return;
    }

    if (password.newPassword.length < 6) {
      setMessage("New password must contain at least 6 characters.");
      return;
    }

    if (password.newPassword !== password.confirmPassword) {
      setMessage("New Password and Confirm Password do not match.");
      return;
    }

    setMessage("Password validation successful!");

    setPassword({
      current: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <Layout>
      <h1>Settings</h1>

      {message && (
        <div className="settings-message">
          {message}
        </div>
      )}

      {/* Profile Settings */}
      <div className="settings-card">
        <h2>Profile Settings</h2>

        <form onSubmit={handleProfileUpdate}>
          <input
            type="text"
            placeholder="Full Name"
            value={profile.name}
            onChange={(e) =>
              setProfile({
                ...profile,
                name: e.target.value,
              })
            }
          />

          <input
            type="email"
            placeholder="Email"
            value={profile.email}
            onChange={(e) =>
              setProfile({
                ...profile,
                email: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={profile.phone}
            onChange={(e) =>
              setProfile({
                ...profile,
                phone: e.target.value,
              })
            }
          />

          <button type="submit">
            Update Profile
          </button>
        </form>
      </div>

      {/* Password Settings */}
      <div className="settings-card">
        <h2>Change Password</h2>

        <form onSubmit={handlePasswordChange}>
          <input
            type="password"
            placeholder="Current Password"
            value={password.current}
            onChange={(e) =>
              setPassword({
                ...password,
                current: e.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="New Password"
            value={password.newPassword}
            onChange={(e) =>
              setPassword({
                ...password,
                newPassword: e.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={password.confirmPassword}
            onChange={(e) =>
              setPassword({
                ...password,
                confirmPassword: e.target.value,
              })
            }
          />

          <button type="submit">
            Change Password
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default Settings;