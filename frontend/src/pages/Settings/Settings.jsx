import { useState } from "react";
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

  const handleProfileUpdate = () => {
    alert("Profile Updated Successfully!");
  };

  const handlePasswordChange = () => {
    if (password.newPassword !== password.confirmPassword) {
      alert("New Password and Confirm Password do not match.");
      return;
    }

    alert("Password Changed Successfully!");

    setPassword({
      current: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <Layout>
      <h1>Settings</h1>

      <div className="settings-card">
        <h2>Profile Settings</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={profile.name}
          onChange={(e) =>
            setProfile({ ...profile, name: e.target.value })
          }
        />

        <input
          type="email"
          placeholder="Email"
          value={profile.email}
          onChange={(e) =>
            setProfile({ ...profile, email: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={profile.phone}
          onChange={(e) =>
            setProfile({ ...profile, phone: e.target.value })
          }
        />

        <button onClick={handleProfileUpdate}>
          Update Profile
        </button>
      </div>

      <div className="settings-card">
        <h2>Change Password</h2>

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

        <button onClick={handlePasswordChange}>
          Change Password
        </button>
      </div>
    </Layout>
  );
}

export default Settings;