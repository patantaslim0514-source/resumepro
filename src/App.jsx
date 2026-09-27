
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import Templates from "./pages/Templates";
import Builder from "./pages/Builder";
import AITools from "./pages/AITools";
import JobMatch from "./pages/JobMatch";
import ATSChecker from "./pages/ATSChecker";
import Login from "./pages/Login";


/* =====================================================
   HOME PAGE
===================================================== */

function Home() {
  return (
    <div className="app">


      {/* =================================================
         NAVBAR
      ================================================= */}

      <header className="navbar">


        {/* LOGO */}

        <div
          className="logo"
          onClick={() =>
            (window.location.href = "/")
          }
          style={{ cursor: "pointer" }}
        >
          Resume<span>Pro</span>
        </div>



        {/* NAVIGATION */}

        <nav className="nav-links">

          <a href="/templates">
            Templates
          </a>

          <a href="/builder">
            Resume Builder
          </a>

          <a href="/ai-tools">
            AI Tools
          </a>

          <a href="/job-match">
            Job Match
          </a>

        </nav>



        {/* RIGHT BUTTONS */}

        <div className="nav-buttons">


          {/* ================= LOGIN ================= */}

          <button
            className="login-btn"
            onClick={() =>
              (window.location.href = "/login")
            }
          >
            Login
          </button>



          {/* ================= CREATE RESUME ================= */}

          <button
            className="create-btn"
            onClick={() =>
              (window.location.href = "/builder")
            }
          >
            Create Resume
          </button>


        </div>

      </header>



      {/* =================================================
         MAIN
      ================================================= */}

      <main>


        {/* =================================================
           HERO
        ================================================= */}

        <section className="hero">


          {/* HERO CONTENT */}

          <div className="hero-content">


            <div className="badge">
              ✨ Smart Resume Builder
            </div>



            <h1>

              Build a Resume

              <br />

              <span>
                That Gets Noticed.
              </span>

            </h1>



            <p>
              Create a professional resume, optimize it for
              real job descriptions, and apply with confidence.
            </p>



            {/* HERO BUTTONS */}

            <div className="hero-buttons">


              <button
                className="primary-btn"
                onClick={() =>
                  (window.location.href = "/builder")
                }
              >
                Create My Resume →
              </button>



              <a
                href="/templates"
                className="secondary-btn"
              >
                View Templates
              </a>


            </div>



            {/* TRUST */}

            <div className="trust-text">

              <span>
                ✓ Professional Templates
              </span>

              <span>
                ✓ AI-Powered Tools
              </span>

              <span>
                ✓ ATS Friendly
              </span>

            </div>


          </div>



          {/* =================================================
             RESUME PREVIEW
          ================================================= */}

          <div className="hero-preview">


            <div className="preview-glow"></div>



            <div className="resume-card">


              <div className="resume-top">


                <div className="profile-circle">
                  TP
                </div>


                <div>

                  <h3>
                    Your Name
                  </h3>

                  <p>
                    Computer Science Student
                  </p>

                </div>


              </div>



              <div className="resume-line long"></div>

              <div className="resume-line medium"></div>



              <div className="preview-section">

                <h4>
                  EDUCATION
                </h4>

                <div className="resume-line long"></div>

                <div className="resume-line medium"></div>

              </div>



              <div className="preview-section">

                <h4>
                  SKILLS
                </h4>



                <div className="skill-row">

                  <span>
                    Java
                  </span>

                  <span>
                    React
                  </span>

                  <span>
                    Python
                  </span>

                </div>



                <div className="skill-row">

                  <span>
                    SQL
                  </span>

                  <span>
                    Git
                  </span>

                  <span>
                    AI / ML
                  </span>

                </div>


              </div>



              <div className="preview-section">

                <h4>
                  PROJECTS
                </h4>

                <div className="resume-line long"></div>

                <div className="resume-line short"></div>

              </div>


            </div>



            {/* ATS CARD */}

            <div className="floating-card ats-card">

              <div className="check-icon">
                ✓
              </div>

              <div>

                <strong>
                  ATS Ready
                </strong>

                <small>
                  Resume optimized
                </small>

              </div>

            </div>



            {/* AI CARD */}

            <div className="floating-card ai-card">

              <div className="sparkle">
                ✦
              </div>

              <div>

                <strong>
                  AI Suggestions
                </strong>

                <small>
                  Improve your resume
                </small>

              </div>

            </div>


          </div>

        </section>



        {/* =================================================
           FEATURES
        ================================================= */}

        <section className="features">


          <div className="section-heading">

            <p className="small-title">
              EVERYTHING YOU NEED
            </p>


            <h2>

              From Resume to

              <span>
                Opportunity.
              </span>

            </h2>


            <p>
              Build, optimize and manage your entire job
              application journey in one place.
            </p>

          </div>



          <div className="feature-grid">


            {/* BUILD */}

            <div className="feature-card">

              <div className="feature-icon">
                📄
              </div>

              <h3>
                Build Your Resume
              </h3>

              <p>
                Create professional resumes using clean and
                modern templates.
              </p>

              <a href="/builder">
                Start Building →
              </a>

            </div>



            {/* AI TOOLS */}

            <div
              className="feature-card"
              id="ai-tools"
            >

              <div className="feature-icon">
                ✨
              </div>

              <h3>
                AI Resume Tools
              </h3>

              <p>
                Improve summaries, bullet points and project
                descriptions.
              </p>

              <a href="/ai-tools">
                Explore AI Tools →
              </a>

            </div>



            {/* JOB MATCH */}

            <div
              className="feature-card"
              id="job-match"
            >

              <div className="feature-icon">
                🎯
              </div>

              <h3>
                Job Match
              </h3>

              <p>
                Compare your resume with a job description
                and find skill gaps.
              </p>

              <a href="/job-match">
                Analyze Job →
              </a>

            </div>



            {/* ATS */}

            <div
              className="feature-card"
              id="ats"
            >

              <div className="feature-icon">
                📊
              </div>

              <h3>
                ATS Checker
              </h3>

              <p>
                Check your resume structure and discover
                areas for improvement.
              </p>

              <a href="/ats-checker">
                Check Resume →
              </a>

            </div>


          </div>

        </section>



        {/* =================================================
           HOW IT WORKS
        ================================================= */}

        <section className="how-section">


          <div className="section-heading">

            <p className="small-title">
              SIMPLE PROCESS
            </p>

            <h2>

              Your Career Journey,

              <span>
                Simplified.
              </span>

            </h2>

          </div>



          <div className="steps">


            <div className="step">

              <div className="step-number">
                01
              </div>

              <h3>
                Build
              </h3>

              <p>
                Create your professional resume.
              </p>

            </div>



            <div className="step-arrow">
              →
            </div>



            <div className="step">

              <div className="step-number">
                02
              </div>

              <h3>
                Optimize
              </h3>

              <p>
                Improve your resume for specific jobs.
              </p>

            </div>



            <div className="step-arrow">
              →
            </div>



            <div className="step">

              <div className="step-number">
                03
              </div>

              <h3>
                Check
              </h3>

              <p>
                Analyze ATS compatibility and keywords.
              </p>

            </div>



            <div className="step-arrow">
              →
            </div>



            <div className="step">

              <div className="step-number">
                04
              </div>

              <h3>
                Apply
              </h3>

              <p>
                Apply with confidence.
              </p>

            </div>


          </div>

        </section>



        {/* =================================================
           CTA
        ================================================= */}

        <section className="cta-section">


          <div className="cta-content">


            <p className="small-title">
              START YOUR JOURNEY
            </p>


            <h2>

              Ready to Build Your

              <br />

              <span>
                Career?
              </span>

            </h2>


            <p>
              Create your professional resume and take the
              next step toward your dream opportunity.
            </p>



            <button
              className="primary-btn"
              onClick={() =>
                (window.location.href = "/builder")
              }
            >
              Create My Resume →
            </button>


          </div>

        </section>


      </main>



      {/* =================================================
         FOOTER
      ================================================= */}

      <footer className="footer">


        <div className="footer-logo">

          Resume<span>
            Pro
          </span>

        </div>


        <p>
          Build. Optimize. Apply.
        </p>



        <div className="footer-links">


          <a href="/templates">
            Templates
          </a>


          <a href="/builder">
            Resume Builder
          </a>


          <a href="/ai-tools">
            AI Tools
          </a>


          <a href="/job-match">
            Job Match
          </a>


          <a href="/ats-checker">
            ATS Checker
          </a>


          {/* LOGIN LINK */}

          <a href="/login">
            Login
          </a>


        </div>



        <p className="copyright">
          © 2026 ResumePro. All rights reserved.
        </p>


      </footer>

    </div>
  );
}



/* =====================================================
   APP ROUTES
===================================================== */

function App() {

  return (

    <BrowserRouter>

      <Routes>


        {/* HOME */}

        <Route
          path="/"
          element={<Home />}
        />



        {/* TEMPLATES */}

        <Route
          path="/templates"
          element={<Templates />}
        />



        {/* BUILDER */}

        <Route
          path="/builder"
          element={<Builder />}
        />



        {/* AI TOOLS */}

        <Route
          path="/ai-tools"
          element={<AITools />}
        />



        {/* JOB MATCH */}

        <Route
          path="/job-match"
          element={<JobMatch />}
        />



        {/* ATS CHECKER */}

        <Route
          path="/ats-checker"
          element={<ATSChecker />}
        />



        {/* LOGIN / SIGNUP */}

        <Route
          path="/login"
          element={<Login />}
        />

      </Routes>

    </BrowserRouter>

  );
}


export default App;