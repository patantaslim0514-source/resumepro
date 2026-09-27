
import React, { useEffect, useState } from "react";
import "./JobMatch.css";

function JobMatch() {
  const [resumeText, setResumeText] = useState("");
  const [jobText, setJobText] = useState("");
  const [result, setResult] = useState(null);

  // ================= LOAD BUILDER RESUME =================
  useEffect(() => {
    try {
      const savedResume = localStorage.getItem(
        "resumeProATSResume"
      );

      if (!savedResume) {
        return;
      }

      const resume = JSON.parse(savedResume);

      const educationText = Array.isArray(
        resume.educationEntries
      )
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

      const skillsText = Array.isArray(
        resume.skillEntries
      )
        ? resume.skillEntries
            .map(
              (item) =>
                item.name ||
                item.skill ||
                item
            )
            .join(", ")
        : resume.skills || "";

      const projectsText = [
        resume.projectName,
        resume.projectDescription,
        ...(Array.isArray(
          resume.additionalProjects
        )
          ? resume.additionalProjects.flatMap(
              (project) => [
                project.name,
                project.description,
              ]
            )
          : []),
      ]
        .filter(Boolean)
        .join("\n");

      const customSectionsText = Array.isArray(
        resume.customSections
      )
        ? resume.customSections
            .map((section) =>
              [
                section.title,
                section.content,
              ]
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
      console.error(
        "Job Match resume load error:",
        error
      );
    }
  }, []);

  // ================= ANALYZE JOB =================
  const analyzeJob = () => {
    if (
      !resumeText.trim() ||
      !jobText.trim()
    ) {
      alert(
        "Please enter both Resume and Job Description."
      );
      return;
    }

    const resumeWords = resumeText
      .toLowerCase()
      .split(/[\s,.;:()\/|]+/)
      .filter(Boolean);

    const jobWords = jobText
      .toLowerCase()
      .split(/[\s,.;:()\/|]+/)
      .filter(Boolean);

    const skills = [
      "java",
      "python",
      "javascript",
      "typescript",
      "react",
      "html",
      "css",
      "sql",
      "git",
      "github",
      "node",
      "nodejs",
      "mongodb",
      "mysql",
      "oracle",
      "flutter",
      "dart",
      "firebase",
      "machine",
      "learning",
      "deep",
      "ai",
      "artificial",
      "intelligence",
      "data",
      "analytics",
      "communication",
      "leadership",
      "problem",
      "solving",
      "figma",
      "excel",
      "powerpoint",
      "aws",
      "docker",
      "linux",
      "c",
      "cpp",
      "c++",
    ];

    const jobSkills = skills.filter(
      (skill) =>
        jobWords.includes(skill)
    );

    const matchedSkills = jobSkills.filter(
      (skill) =>
        resumeWords.includes(skill)
    );

    const missingSkills = jobSkills.filter(
      (skill) =>
        !resumeWords.includes(skill)
    );

    let percentage = 0;

    if (jobSkills.length > 0) {
      percentage = Math.round(
        (matchedSkills.length /
          jobSkills.length) *
          100
      );
    } else {
      const commonWords = jobWords.filter(
        (word) =>
          resumeWords.includes(word) &&
          word.length > 3
      );

      percentage = Math.min(
        100,
        Math.round(
          (commonWords.length /
            Math.max(
              jobWords.length,
              1
            )) *
            100
        )
      );
    }

    const importantKeywords =
      jobSkills.slice(0, 8);

    setResult({
      percentage,
      matchedSkills,
      missingSkills,
      importantKeywords,
    });
  };

  return (
    <div className="job-page">

      {/* NAVBAR */}

      <header className="job-navbar">

        <div
          className="job-logo"
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

          <a
            href="/job-match"
            className="active"
          >
            Job Match
          </a>

        </nav>

        <button
          className="job-create-btn"
          onClick={() =>
            (window.location.href =
              "/builder")
          }
        >
          Create Resume
        </button>

      </header>


      {/* HERO */}

      <section className="job-hero">

        <div className="job-badge">
          🎯 SMART JOB MATCH
        </div>

        <h1>
          Match Your Resume
          <span>
            With The Job.
          </span>
        </h1>

        <p>
          Compare your resume with a job
          description and discover matching
          skills, missing skills and important
          keywords.
        </p>

      </section>


      {/* MAIN */}

      <section className="job-content">

        {/* RESUME */}

        <div className="job-input-card">

          <div className="input-title">

            <div className="input-number">
              01
            </div>

            <div>
              <h2>
                Your Resume
              </h2>

              <p>
                Your latest resume from
                Resume Builder is loaded
                automatically.
              </p>
            </div>

          </div>

          <textarea
            value={resumeText}
            onChange={(e) =>
              setResumeText(
                e.target.value
              )
            }
            placeholder="Your resume content will appear here..."
          />

          <div className="character-count">
            {resumeText.length} characters
          </div>

        </div>


        {/* JOB DESCRIPTION */}

        <div className="job-input-card">

          <div className="input-title">

            <div className="input-number">
              02
            </div>

            <div>
              <h2>
                Job Description
              </h2>

              <p>
                Paste the job description
                here.
              </p>
            </div>

          </div>

          <textarea
            value={jobText}
            onChange={(e) =>
              setJobText(
                e.target.value
              )
            }
            placeholder="Example: We are looking for a Java developer with SQL, Git and problem-solving skills..."
          />

          <div className="character-count">
            {jobText.length} characters
          </div>

        </div>

      </section>


      {/* ANALYZE BUTTON */}

      <div className="analyze-area">

        <button
          className="analyze-btn"
          onClick={analyzeJob}
        >
          🎯 Analyze Job Match
        </button>

      </div>


      {/* RESULTS */}

      {result && (

        <section className="results-section">

          <div className="results-heading">

            <p>
              ANALYSIS COMPLETE
            </p>

            <h2>
              Your Job Match Results
            </h2>

          </div>


          {/* SCORE */}

          <div className="score-card">

            <div className="score-circle">

              <strong>
                {result.percentage}%
              </strong>

              <span>
                Match
              </span>

            </div>


            <div className="score-info">

              <h3>
                Resume Compatibility
              </h3>

              <p>
                This score is based on
                skills and keywords found
                in the resume and job
                description.
              </p>

              <div className="score-bar">

                <div
                  style={{
                    width: `${result.percentage}%`,
                  }}
                ></div>

              </div>

            </div>

          </div>


          {/* RESULT GRID */}

          <div className="result-grid">


            {/* MATCHED */}

            <div className="result-card">

              <div className="result-card-title">

                <span>
                  ✅
                </span>

                <h3>
                  Matching Skills
                </h3>

              </div>

              <div className="tag-container">

                {result.matchedSkills.length >
                0 ? (

                  result.matchedSkills.map(
                    (skill, index) => (

                      <span
                        className="match-tag"
                        key={index}
                      >
                        {skill}
                      </span>

                    )
                  )

                ) : (

                  <p className="no-result">
                    No matching skills found.
                  </p>

                )}

              </div>

            </div>


            {/* MISSING */}

            <div className="result-card">

              <div className="result-card-title">

                <span>
                  ⚠️
                </span>

                <h3>
                  Missing Skills
                </h3>

              </div>

              <div className="tag-container">

                {result.missingSkills.length >
                0 ? (

                  result.missingSkills.map(
                    (skill, index) => (

                      <span
                        className="missing-tag"
                        key={index}
                      >
                        {skill}
                      </span>

                    )
                  )

                ) : (

                  <p className="no-result">
                    No major missing skills
                    detected.
                  </p>

                )}

              </div>

            </div>


            {/* KEYWORDS */}

            <div className="result-card">

              <div className="result-card-title">

                <span>
                  🔑
                </span>

                <h3>
                  Important Keywords
                </h3>

              </div>

              <div className="tag-container">

                {result.importantKeywords
                  .length > 0 ? (

                  result.importantKeywords.map(
                    (keyword, index) => (

                      <span
                        className="keyword-tag"
                        key={index}
                      >
                        {keyword}
                      </span>

                    )
                  )

                ) : (

                  <p className="no-result">
                    No keywords detected.
                  </p>

                )}

              </div>

            </div>

          </div>


          {/* SUGGESTION */}

          <div className="suggestion-card">

            <div className="suggestion-icon">
              ✨
            </div>

            <div>

              <h3>
                Resume Improvement Tip
              </h3>

              <p>
                Add relevant missing skills
                only when you genuinely have
                those skills or experience.
                You can also improve your
                project descriptions using
                the AI Tools.
              </p>

            </div>

            <button
              onClick={() =>
                (window.location.href =
                  "/ai-tools")
              }
            >
              Open AI Tools →
            </button>

          </div>

        </section>

      )}


      {/* FOOTER */}

      <footer className="job-footer">

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

export default JobMatch;