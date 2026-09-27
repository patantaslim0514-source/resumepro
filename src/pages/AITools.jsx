
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  Wand2,
  Lightbulb,
  FileText,
  BriefcaseBusiness,
  Copy,
  Check,
  Download,
  ArrowRight,
} from "lucide-react";
import "./AITools.css";

function getCurrentUser() {
  try {
    const saved = localStorage.getItem("resumeProCurrentUser");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function getResume() {
  const user = getCurrentUser();

  try {
    if (user?.resume) {
      return user.resume;
    }

    const guest = sessionStorage.getItem("resumeProGuestDraft");

    if (guest) {
      return JSON.parse(guest);
    }

    const oldData = localStorage.getItem("resumeProData");

    if (oldData) {
      return JSON.parse(oldData);
    }
  } catch {
    return null;
  }

  return null;
}

function saveResume(updatedResume) {
  const currentUser = getCurrentUser();

  try {
    if (currentUser) {
      const users = JSON.parse(
        localStorage.getItem("resumeProUsers") || "[]"
      );

      const updatedUsers = users.map((user) => {
        if (user.email === currentUser.email) {
          return {
            ...user,
            resume: updatedResume,
          };
        }

        return user;
      });

      localStorage.setItem(
        "resumeProUsers",
        JSON.stringify(updatedUsers)
      );

      localStorage.setItem(
        "resumeProCurrentUser",
        JSON.stringify({
          ...currentUser,
          resume: updatedResume,
        })
      );
    } else {
      sessionStorage.setItem(
        "resumeProGuestDraft",
        JSON.stringify(updatedResume)
      );
    }

    localStorage.setItem(
      "resumeProData",
      JSON.stringify(updatedResume)
    );

    return true;
  } catch {
    return false;
  }
}

function improveSummary(resume) {
  const name = resume?.name || "The candidate";
  const role = resume?.role || "motivated professional";

  return `${name} is a ${role} with a strong interest in developing practical skills and contributing to real-world projects. Demonstrates a willingness to learn, solve problems, work collaboratively, and continuously improve technical and professional abilities.`;
}

function suggestSkills(resume) {
  const role = (resume?.role || "").toLowerCase();

  if (
    role.includes("software") ||
    role.includes("developer") ||
    role.includes("engineer")
  ) {
    return [
      "Java",
      "Python",
      "JavaScript",
      "HTML",
      "CSS",
      "React",
      "Git",
      "GitHub",
      "SQL",
      "Problem Solving",
    ];
  }

  if (
    role.includes("data") ||
    role.includes("ai") ||
    role.includes("machine")
  ) {
    return [
      "Python",
      "Machine Learning",
      "Data Analysis",
      "SQL",
      "Pandas",
      "NumPy",
      "Scikit-learn",
      "Data Visualization",
      "Git",
      "Problem Solving",
    ];
  }

  return [
    "Communication",
    "Problem Solving",
    "Teamwork",
    "Leadership",
    "Time Management",
    "Adaptability",
    "Microsoft Office",
    "Research",
  ];
}

function improveProject(resume) {
  const projectName =
    resume?.projectName || "your project";

  const description =
    resume?.projectDescription ||
    "Developed a project using relevant technologies.";

  return `${projectName}

• Designed and developed ${projectName} to solve a practical problem.
• Implemented the core functionality using appropriate technologies and development practices.
• Focused on creating a simple, useful, and user-friendly solution.
• Tested the major features and improved the overall project functionality.

Original description:
${description}`;
}

function improveExperience(resume) {
  const experience =
    resume?.experience?.trim();

  if (!experience) {
    return `• Worked on assigned tasks and completed project activities within deadlines.
• Applied technical and problem-solving skills to practical requirements.
• Collaborated with team members and communicated progress effectively.
• Learned and applied new tools and technologies during the work.`;
  }

  return `• Contributed to assigned tasks and project activities.
• Applied relevant technical and problem-solving skills.
• Collaborated effectively with team members.
• Improved project functionality through testing and continuous learning.

Original experience:
${experience}`;
}

function getInitialText(tool, resume) {
  if (!resume) return "";

  if (tool === "summary") {
    return resume.summary || "";
  }

  if (tool === "skills") {
    if (Array.isArray(resume.skillEntries)) {
      return resume.skillEntries
        .map((item) => item.name || item)
        .join(", ");
    }

    return resume.skills || "";
  }

  if (tool === "project") {
    return resume.projectDescription || "";
  }

  if (tool === "experience") {
    return resume.experience || "";
  }

  return "";
}

export default function AITools() {
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);

  const [activeTool, setActiveTool] =
    useState("summary");

  const [inputText, setInputText] =
    useState("");

  const [result, setResult] =
    useState("");

  const [copied, setCopied] =
    useState(false);

  const [applied, setApplied] =
    useState(false);

  useEffect(() => {
    const loadedResume = getResume();

    setResume(loadedResume);

    if (loadedResume) {
      setInputText(
        getInitialText(
          "summary",
          loadedResume
        )
      );
    }
  }, []);

  const tools = [
    {
      id: "summary",
      title: "Improve Summary",
      description:
        "Create a stronger professional summary.",
      icon: FileText,
    },
    {
      id: "skills",
      title: "Suggest Skills",
      description:
        "Get relevant skills based on your role.",
      icon: Lightbulb,
    },
    {
      id: "project",
      title: "Improve Project",
      description:
        "Turn your project into strong resume bullets.",
      icon: Wand2,
    },
    {
      id: "experience",
      title: "Improve Experience",
      description:
        "Convert experience into professional bullets.",
      icon: BriefcaseBusiness,
    },
  ];

  const handleToolChange = (toolId) => {
    setActiveTool(toolId);

    setResult("");

    setCopied(false);

    setApplied(false);

    setInputText(
      getInitialText(
        toolId,
        resume
      )
    );
  };

  const handleGenerate = () => {
    if (!resume) {
      setResult(
        "No resume found. Please create your resume in Builder first."
      );

      return;
    }

    let output = "";

    if (activeTool === "summary") {
      output = improveSummary(resume);
    }

    if (activeTool === "skills") {
      output = suggestSkills(resume).join(" • ");
    }

    if (activeTool === "project") {
      output = improveProject(resume);
    }

    if (activeTool === "experience") {
      output = improveExperience(resume);
    }

    setResult(output);

    setApplied(false);
  };

  const handleApply = () => {
    if (!resume || !result) return;

    const updatedResume = {
      ...resume,
    };

    if (activeTool === "summary") {
      updatedResume.summary = result;
    }

    if (activeTool === "skills") {
      const skills = result
        .split("•")
        .map((skill) => skill.trim())
        .filter(Boolean);

      updatedResume.skillEntries =
        skills.map((skill) => ({
          name: skill,
        }));

      updatedResume.skills =
        skills.join(", ");
    }

    if (activeTool === "project") {
      const cleanProject = result
        .replace(
          updatedResume.projectName || "your project",
          ""
        )
        .replace(
          /Original description:[\s\S]*/,
          ""
        )
        .trim();

      updatedResume.projectDescription =
        cleanProject;
    }

    if (activeTool === "experience") {
      const cleanExperience = result
        .replace(
          /Original experience:[\s\S]*/,
          ""
        )
        .trim();

      updatedResume.experience =
        cleanExperience;
    }

    const success = saveResume(updatedResume);

    if (success) {
      setResume(updatedResume);

      setInputText(
        getInitialText(
          activeTool,
          updatedResume
        )
      );

      setApplied(true);

      setTimeout(() => {
        setApplied(false);
      }, 2500);
    }
  };

  const handleCopy = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      alert(
        "Copy failed. Please copy manually."
      );
    }
  };

  const currentTool =
    tools.find(
      (tool) =>
        tool.id === activeTool
    );

  return (
    <div className="ai-tools-page">

      {/* HEADER */}
      <header className="ai-tools-header">

        <Link
          to="/"
          className="ai-tools-logo"
        >
          <div className="ai-logo-icon">
            <Sparkles size={19} />
          </div>

          <span>ResumePro</span>
        </Link>

        <div className="ai-header-actions">

          <button
            className="ai-back-btn"
            onClick={() =>
              navigate("/builder")
            }
          >
            <ArrowLeft size={17} />

            Back to Builder
          </button>

        </div>

      </header>


      {/* HERO */}
      <section className="ai-tools-hero">

        <div className="ai-hero-icon">
          <Sparkles size={25} />
        </div>

        <h1>
          AI Resume Tools
        </h1>

        <p>
          Improve your resume content
          using smart suggestions based
          on your resume.
        </p>

      </section>


      <main className="ai-tools-container">

        {/* RESUME STATUS */}
        <div className="ai-resume-status">

          <div>

            <strong>
              {resume?.name
                ? `${resume.name}'s Resume`
                : "No Resume Loaded"}
            </strong>

            <span>
              {resume
                ? "Your Builder data is connected."
                : "Create a resume in Builder first."}
            </span>

          </div>

          <button
            onClick={() =>
              navigate("/builder")
            }
          >
            Open Builder
          </button>

        </div>


        {/* TOOL GRID */}
        <div className="ai-tool-grid">

          {tools.map((tool) => {

            const Icon = tool.icon;

            return (
              <button
                key={tool.id}
                className={
                  activeTool === tool.id
                    ? "ai-tool-card active"
                    : "ai-tool-card"
                }
                onClick={() =>
                  handleToolChange(
                    tool.id
                  )
                }
              >

                <div className="ai-tool-icon">
                  <Icon size={20} />
                </div>

                <div>

                  <h3>
                    {tool.title}
                  </h3>

                  <p>
                    {tool.description}
                  </p>

                </div>

              </button>
            );
          })}

        </div>


        {/* WORKSPACE */}
        <section className="ai-workspace">

          <div className="ai-workspace-header">

            <div>

              <h2>
                {currentTool?.title}
              </h2>

              <p>
                {currentTool?.description}
              </p>

            </div>

            <div className="ai-powered">

              <Sparkles size={15} />

              Smart Suggestions

            </div>

          </div>


          <div className="ai-workspace-grid">

            {/* CURRENT CONTENT */}
            <div className="ai-panel">

              <div className="ai-panel-title">
                Your Current Content
              </div>

              <textarea
                value={inputText}
                onChange={(e) =>
                  setInputText(
                    e.target.value
                  )
                }
                placeholder={
                  resume
                    ? "Your resume content will appear here..."
                    : "Create a resume first..."
                }
              />

            </div>


            {/* RESULT */}
            <div className="ai-panel">

              <div className="ai-panel-title ai-result-title">

                <span>
                  Improved Result
                </span>

                <div className="ai-result-actions">

                  {result && (
                    <button
                      className="copy-btn"
                      onClick={
                        handleCopy
                      }
                    >
                      {copied ? (
                        <>
                          <Check
                            size={15}
                          />

                          Copied
                        </>
                      ) : (
                        <>
                          <Copy
                            size={15}
                          />

                          Copy
                        </>
                      )}
                    </button>
                  )}

                </div>

              </div>


              <div className="ai-result-box">

                {result ? (
                  <pre>
                    {result}
                  </pre>
                ) : (
                  <div className="ai-empty-result">

                    <Sparkles
                      size={28}
                    />

                    <p>
                      Your improved content
                      will appear here.
                    </p>

                  </div>
                )}

              </div>

            </div>

          </div>


          {/* GENERATE */}
          <button
            className="ai-generate-btn"
            onClick={
              handleGenerate
            }
          >
            <Sparkles size={18} />

            Generate Suggestions
          </button>


          {/* APPLY */}
          {result && (
            <button
              className="ai-apply-btn"
              onClick={
                handleApply
              }
            >
              {applied ? (
                <>
                  <Check size={18} />

                  Applied to Resume
                </>
              ) : (
                <>
                  <Download size={18} />

                  Apply to My Resume

                  <ArrowRight
                    size={17}
                  />
                </>
              )}
            </button>
          )}


          {applied && (
            <div className="ai-success-message">

              <Check size={16} />

              Changes saved successfully.
              Open Builder to see the updated resume.

            </div>
          )}

        </section>

      </main>

    </div>
  );
}