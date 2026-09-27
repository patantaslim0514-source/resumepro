
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getUsers = () => {
    try {
      return JSON.parse(localStorage.getItem("resumeProUsers")) || [];
    } catch {
      return [];
    }
  };

  const saveUsers = (users) => {
    localStorage.setItem("resumeProUsers", JSON.stringify(users));
  };

  const getGuestResume = () => {
    try {
      const guestResume = sessionStorage.getItem("resumeProGuestDraft");

      if (!guestResume) {
        return null;
      }

      return JSON.parse(guestResume);
    } catch {
      return null;
    }
  };

  const saveUser = (user) => {
    const users = getUsers();

    const updatedUsers = users.map((item) =>
      item.email === user.email ? user : item
    );

    saveUsers(updatedUsers);
  };

  const handleLogin = (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    const users = getUsers();

    const user = users.find(
      (item) =>
        item.email.toLowerCase() === email.trim().toLowerCase() &&
        item.password === password
    );

    if (!user) {
      setError("Invalid email or password.");
      return;
    }

    /*
      IMPORTANT:
      If user created a resume before login,
      take that temporary guest resume and save it
      inside this user's account.
    */
    const guestResume = getGuestResume();

    let updatedUser = user;

    if (guestResume) {
      updatedUser = {
        ...user,
        resume: guestResume,
      };

      saveUser(updatedUser);

      sessionStorage.removeItem("resumeProGuestDraft");
    }

    localStorage.setItem(
      "resumeProCurrentUser",
      JSON.stringify(updatedUser)
    );

    setSuccess("Login successful! Your resume has been saved.");

    setTimeout(() => {
      navigate("/builder");
    }, 700);
  };

  const handleSignup = (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const users = getUsers();

    const existingUser = users.find(
      (item) =>
        item.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (existingUser) {
      setError("An account with this email already exists.");
      return;
    }

    /*
      Get the resume created before signup.
    */
    const guestResume = getGuestResume();

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      resume: guestResume || null,
    };

    saveUsers([...users, newUser]);

    localStorage.setItem(
      "resumeProCurrentUser",
      JSON.stringify(newUser)
    );

    /*
      Guest draft is now permanently attached
      to this demo account.
    */
    sessionStorage.removeItem("resumeProGuestDraft");

    setSuccess(
      guestResume
        ? "Account created! Your resume has been saved."
        : "Account created successfully!"
    );

    setTimeout(() => {
      navigate("/builder");
    }, 700);
  };

  const switchMode = () => {
    setIsSignup((prev) => !prev);

    setError("");
    setSuccess("");

    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="login-page">
      <div className="login-background-circle circle-one"></div>
      <div className="login-background-circle circle-two"></div>

      <div className="login-container">
        <div className="login-left">
          <div
            className="login-logo"
            onClick={() => navigate("/")}
          >
            Resume<span>Pro</span>
          </div>

          <div className="login-left-content">
            <div className="login-icon">📄</div>

            <h1>
              Build your resume.
              <br />
              <span>Get noticed.</span>
            </h1>

            <p>
              Create a professional resume, improve it with smart
              tools and prepare for your next opportunity.
            </p>

            <div className="login-features">
              <div>
                <span>✓</span>
                Create professional resumes
              </div>

              <div>
                <span>✓</span>
                Check ATS compatibility
              </div>

              <div>
                <span>✓</span>
                Save your resume to your account
              </div>

              <div>
                <span>✓</span>
                Access your resume anytime
              </div>
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="login-card">
            <div className="login-card-header">
              <h2>
                {isSignup
                  ? "Create your account"
                  : "Welcome back"}
              </h2>

              <p>
                {isSignup
                  ? "Create an account to save your resume."
                  : "Login to access your saved resume."}
              </p>
            </div>

            {error && (
              <div className="login-message error">
                ⚠️ {error}
              </div>
            )}

            {success && (
              <div className="login-message success">
                ✓ {success}
              </div>
            )}

            <form
              onSubmit={
                isSignup ? handleSignup : handleLogin
              }
            >
              {isSignup && (
                <div className="login-form-group">
                  <label>Full Name</label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div className="login-form-group">
                <label>Email Address</label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>

              <div className="login-form-group">
                <label>Password</label>

                <div className="password-input-wrapper">
                  <input
                    type={
                      showPassword ? "text" : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter your password"
                  />

                  <button
                    type="button"
                    className="show-password-btn"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {isSignup && (
                <div className="login-form-group">
                  <label>Confirm Password</label>

                  <div className="password-input-wrapper">
                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      placeholder="Confirm your password"
                    />

                    <button
                      type="button"
                      className="show-password-btn"
                      onClick={() =>
                        setShowConfirmPassword(
                          (prev) => !prev
                        )
                      }
                    >
                      {showConfirmPassword
                        ? "Hide"
                        : "Show"}
                    </button>
                  </div>
                </div>
              )}

              {isSignup && (
                <div className="password-note">
                  🔒 Password should contain at least 6
                  characters.
                </div>
              )}

              <button
                type="submit"
                className="login-submit-btn"
              >
                {isSignup
                  ? "Create Account"
                  : "Login"}
              </button>
            </form>

            <div className="login-divider">
              <span>OR</span>
            </div>

            <button
              type="button"
              className="continue-without-login-btn"
              onClick={() => navigate("/builder")}
            >
              Continue without Login
            </button>

            <div className="login-switch">
              <span>
                {isSignup
                  ? "Already have an account?"
                  : "Don't have an account?"}
              </span>

              <button
                type="button"
                onClick={switchMode}
              >
                {isSignup ? "Login" : "Create Account"}
              </button>
            </div>

            <button
              type="button"
              className="back-home-login"
              onClick={() => navigate("/")}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;