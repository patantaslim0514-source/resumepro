
import React, { useEffect, useState } from "react";
import "./ATSChecker.css";

function ATSChecker() {
  const [resumeText, setResumeText] = useState("");
  const [result, setResult] = useState(null);

  // ================= LOAD BUILDER RESUME =================
  useEffect(() => {
    try {
      const savedResume = localStorage.getItem("resumeProATSResume");

      if (!savedResume) {
        return;
      }

      const resume = JSON.parse(savedResume);

      const educationText = Array.isArray(resume.educationEntries)
        ? resume.educationEntries
            .map((item) =>
              [
                item.degree,
                item.branch,
                item.college,
                item.year,
                item.percentage,
                item.cgpa,
              ]
                .filter(Boolean)
                .join(" ")
            )
            .join("\n")
        : "";

      const skillsText = Array.isArray(resume.skillEntries)
        ? resume.skillEntries
            .map((item) => item.name || item.skill || item)
            .join(", ")
        : resume.skills || "";

      const projectsText = [
        resume.projectName,
        resume.projectDescription,
        ...(Array.isArray(resume.additionalProjects)
          ? resume.additionalProjects.flatMap((project) => [
              project.name,
              project.description,
            ])
          : []),
      ]
        .filter(Boolean)
        .join("\n");

      const customSectionsText = Array.isArray(resume.customSections)
        ? resume.customSections
            .map((section) =>
              [section.title, section.content]
                .filter(Boolean)
                .join("\n")
            )
            .join("\n")
        : "";

      const builderResumeText = [
        resume.name,
        resume.role,
        resume.email,
        resume.phone,
        resume.location,
        resume.summary,
        educationText,
        resume.experience,
        projectsText,
        skillsText,
        customSectionsText,
      ]
        .filter(Boolean)
        .join("\n\n");

      if (builderResumeText.trim()) {
        setResumeText(builderResumeText);
      }
    } catch (error) {
      console.error("ATS resume load error:", error);
    }
  }, []);

  // ================= CHECK RESUME =================
  const checkResume = () => {
    if (!resumeText.trim()) {
      alert("Please create or paste your resume first.");
      return;
    }

    const text = resumeText.toLowerCase();

    const checks = [
      {
        name: "Contact Information",
        keywords: ["email", "@", "phone", "mobile"],
      },
      {
        name: "Education",
        keywords: [
          "education",
          "college",
          "university",
          "degree",
          "b.tech",
        ],
      },
      {
        name: "Skills",
        keywords: [
          "skills",
          "technical skills",
          "technologies",
        ],
      },
      {
        name: "Projects",
        keywords: ["projects", "project"],
      },
      {
        name: "Experience",
        keywords: [
          "experience",
          "internship",
          "work experience",
        ],
      },
      {
        name: "Summary",
        keywords: [
          "summary",
          "objective",
          "profile",
        ],
      },
    ];

    const results = checks.map((check) => {
      const found = check.keywords.some((keyword) =>
        text.includes(keyword)
      );

      return {
        name: check.name,
        found,
      };
    });

    const passed = results.filter(
      (item) => item.found
    ).length;

    // ================= SECTION SCORE =================
    // 60 points for important resume sections
    const sectionScore = Math.round(
      (passed / results.length) * 60
    );

    // ================= CONTENT SCORE =================
    // 40 points for resume content quality
    let contentScore = 0;

    // Resume length
    if (resumeText.length >= 800) {
      contentScore += 10;
    } else if (resumeText.length >= 500) {
      contentScore += 7;
    } else if (resumeText.length >= 250) {
      contentScore += 4;
    }

    // Email
    if (text.includes("@")) {
      contentScore += 5;
    }

    // Phone number
    const phonePattern = /\b\d{10}\b/;

    if (phonePattern.test(text.replace(/\s/g, ""))) {
      contentScore += 5;
    }

    // Technical skills
    if (
      text.includes("java") ||
      text.includes("python") ||
      text.includes("javascript") ||
      text.includes("sql") ||
      text.includes("react") ||
      text.includes("html") ||
      text.includes("css")
    ) {
      contentScore += 5;
    }

    // Projects
    if (text.includes("project")) {
      contentScore += 5;
    }

    // Action words
    const actionWords = [
      "developed",
      "created",
      "designed",
      "implemented",
      "built",
      "managed",
      "analyzed",
      "develop",
      "create",
      "design",
      "implement",
    ];

    const hasActionWord = actionWords.some((word) =>
      text.includes(word)
    );

    if (hasActionWord) {
      contentScore += 5;
    }

    // ================= FINAL SCORE =================
    const score = Math.min(
      100,
      sectionScore + contentScore
    );

    // ================= SUGGESTIONS =================
    const suggestions = [];

    if (!text.includes("@")) {
      suggestions.push(
        "Add a professional email address."
      );
    }

    if (
      !phonePattern.test(
        text.replace(/\s/g, "")
      )
    ) {
      suggestions.push(
        "Add a valid 10-digit phone number."
      );
    }

    if (
      !text.includes("summary") &&
      !text.includes("objective") &&
      !text.includes("profile")
    ) {
      suggestions.push(
        "Add a short professional summary."
      );
    }

    if (!text.includes("skills")) {
      suggestions.push(
        "Add a clear Skills section with relevant technical skills."
      );
    }

    if (!text.includes("education")) {
      suggestions.push(
        "Add an Education section with your degree and college details."
      );
    }

    if (!text.includes("project")) {
      suggestions.push(
        "Add relevant academic or personal projects."
      );
    }

    if (
      !text.includes("experience") &&
      !text.includes("internship")
    ) {
      suggestions.push(
        "Add internship or work experience if available."
      );
    }

    if (resumeText.length < 500) {
      suggestions.push(
        "Your resume content is short. Add more relevant details."
      );
    }

    if (!hasActionWord) {
      suggestions.push(
        "Use action words such as Developed, Designed, Implemented, or Created."
      );
    }

    if (suggestions.length === 0) {
      suggestions.push(
        "Your resume contains the main sections and content checked by this ATS analyzer."
      );
    }

    setResult({
      score,
      results,
      suggestions,
    });
  };

  // ================= SCORE MESSAGE =================
  const getScoreMessage = () => {
    if (!result) {
      return "";
    }

    if (result.score >= 80) {
      return "Your resume has most of the important sections.";
    }

    if (result.score >= 60) {
      return "Your resume has a good structure, but some sections can be improved.";
    }

    return "Your resume needs some important sections and improvements.";
  };

  return (
    <div className="ats-page">

      {/* ================= NAVBAR ================= */}
      <header className="ats-navbar">

        <div
          className="ats-logo"
          onClick={() =>
            (window.location.href = "/")
          }
        >
          Resume<span>Pro</span>
        </div>

        <nav>
          <a href="/">
            Home
          </a>

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

        <button
          className="ats-create-btn"
          onClick={() =>
            (window.location.href = "/builder")
          }
        >
          Create Resume
        </button>

      </header>


      {/* ================= HERO ================= */}
      <section className="ats-hero">

        <div className="ats-badge">
          📊 ATS RESUME CHECKER
        </div>

        <h1>
          Is Your Resume
          <span>
            ATS Ready?
          </span>
        </h1>

        <p>
          Check your resume structure and discover
          important areas that can be improved before
          applying for jobs.
        </p>

      </section>


      {/* ================= INPUT ================= */}
      <section className="ats-input-section">

        <div className="ats-input-card">

          <div className="ats-input-header">

            <div>
              <h2>
                Paste Your Resume
              </h2>

              <p>
                Your latest resume from Resume Builder
                is loaded automatically. You can also
                edit or paste resume text below.
              </p>
            </div>

            <div className="ats-input-icon">
              📄
            </div>

          </div>


          <textarea
            value={resumeText}
            onChange={(e) =>
              setResumeText(e.target.value)
            }
            placeholder={`Paste your complete resume content here...

Example:

John Doe

Software Developer

Email: john@email.com

Phone: 9876543210

SUMMARY

Computer Science student...

EDUCATION

B.Tech...

SKILLS

Java, Python, SQL...

PROJECTS

Resume Builder...

EXPERIENCE

Internship...`}
          />


          <div className="ats-input-footer">

            <span>
              {resumeText.length} characters
            </span>

            <button
              className="check-btn"
              onClick={checkResume}
            >
              📊 Check Resume
            </button>

          </div>

        </div>

      </section>


      {/* ================= RESULTS ================= */}
      {result && (
        <section className="ats-results">

          <div className="ats-results-heading">

            <p>
              ANALYSIS COMPLETE
            </p>

            <h2>
              Your ATS Results
            </h2>

          </div>


          {/* ================= SCORE CARD ================= */}
          <div className="ats-score-card">

            <div className="ats-score-circle">

              <strong>
                {result.score}%
              </strong>

              <span>
                ATS Score
              </span>

            </div>


            <div className="ats-score-content">

              <h3>
                {getScoreMessage()}
              </h3>

              <p>
                This score is based on important resume
                sections and content quality checked by
                this ATS analyzer.
              </p>


              <div className="ats-progress">

                <div
                  style={{
                    width: `${result.score}%`,
                  }}
                >
                </div>

              </div>

            </div>

          </div>


          {/* ================= SECTION CHECKS ================= */}
          <div className="ats-check-grid">

            {result.results.map(
              (item, index) => (

                <div
                  className="ats-check-card"
                  key={index}
                >

                  <div
                    className={
                      item.found
                        ? "ats-check-icon pass"
                        : "ats-check-icon fail"
                    }
                  >
                    {item.found
                      ? "✓"
                      : "!"}
                  </div>

                  <div>

                    <h3>
                      {item.name}
                    </h3>

                    <p>
                      {item.found
                        ? "Section detected"
                        : "Section not detected"}
                    </p>

                  </div>

                </div>

              )
            )}

          </div>


          {/* ================= SUGGESTIONS ================= */}
          <div className="ats-suggestion-card">

            <div className="ats-suggestion-top">

              <div className="suggestion-symbol">
                ✨
              </div>

              <div>

                <h2>
                  Improvement Suggestions
                </h2>

                <p>
                  Consider these improvements before
                  submitting your resume.
                </p>

              </div>

            </div>


            <div className="suggestion-list">

              {result.suggestions.map(
                (suggestion, index) => (

                  <div
                    className="suggestion-item"
                    key={index}
                  >

                    <span>
                      →
                    </span>

                    <p>
                      {suggestion}
                    </p>

                  </div>

                )
              )}

            </div>


            <div className="suggestion-actions">

              <button
                onClick={() =>
                  (window.location.href =
                    "/builder")
                }
              >
                Open Resume Builder →
              </button>


              <button
                className="secondary-action"
                onClick={() =>
                  (window.location.href =
                    "/ai-tools")
                }
              >
                Improve With AI →
              </button>

            </div>

          </div>

        </section>
      )}


      {/* ================= FOOTER ================= */}
      <footer className="ats-footer">

        <div>
          Resume<span>Pro</span>
        </div>

        <p>
          Build. Optimize. Apply.
        </p>

        <p>
          © 2026 ResumePro. All rights reserved.
        </p>

      </footer>

    </div>
  );
}

export default ATSChecker;