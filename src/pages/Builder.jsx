
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Home,
  LogIn,
  LogOut,
  Trash2,
  Plus,
  X,
  Printer,
  Sparkles,
  Target,
  ShieldCheck,
  FileText,
  Camera,
  Save,
  Download,
} from "lucide-react";
import "./Builder.css";

const defaultResume = {
  name: "",
  role: "",
  email: "",
  phone: "",
  location: "",
  summary: "",

  education: "",
  college: "",
  year: "",

  educationEntries: [],
  skills: "",
  skillEntries: [],

  projectName: "",
  projectDescription: "",
  additionalProjects: [],

  experience: "",

  photo: "",

  customSections: [],

  showSummary: true,
  showEducation: true,
  showExperience: true,
  showProjects: true,
  showSkills: true,

  sectionStyles: {
    personal: {
      fontFamily: "Arial",
      fontSize: 14,
    },
    summary: {
      fontFamily: "Arial",
      fontSize: 12,
    },
    education: {
      fontFamily: "Arial",
      fontSize: 12,
    },
    experience: {
      fontFamily: "Arial",
      fontSize: 12,
    },
    projects: {
      fontFamily: "Arial",
      fontSize: 12,
    },
    skills: {
      fontFamily: "Arial",
      fontSize: 12,
    },
    custom: {
      fontFamily: "Arial",
      fontSize: 12,
    },
  },
};

/* =========================
   STORAGE HELPERS
========================= */

function getCurrentUser() {
  try {
    const user = localStorage.getItem("resumeProCurrentUser");

    if (!user) {
      return null;
    }

    return JSON.parse(user);
  } catch (error) {
    console.error("Current user error:", error);
    return null;
  }
}

function getGuestResume() {
  try {
    const data = sessionStorage.getItem("resumeProGuestDraft");

    if (!data) {
      return null;
    }

    return JSON.parse(data);
  } catch (error) {
    console.error("Guest resume error:", error);
    return null;
  }
}

function saveGuestResume(resume) {
  try {
    sessionStorage.setItem(
      "resumeProGuestDraft",
      JSON.stringify(resume)
    );
  } catch (error) {
    console.error("Guest save error:", error);
  }
}

function saveUserResume(resume) {
  try {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      return;
    }

    const users = JSON.parse(
      localStorage.getItem("resumeProUsers") || "[]"
    );

    const updatedUsers = users.map((user) => {
      if (user.email === currentUser.email) {
        return {
          ...user,
          resume,
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
        resume,
      })
    );
  } catch (error) {
    console.error("User resume save error:", error);
  }
}

/* =========================
   RESUME NORMALIZATION
========================= */

function prepareResume(data) {
  const source = data || {};

  return {
    ...defaultResume,
    ...source,

    educationEntries: Array.isArray(source.educationEntries)
      ? source.educationEntries
      : [],

    skillEntries: Array.isArray(source.skillEntries)
      ? source.skillEntries
      : [],

    additionalProjects: Array.isArray(
      source.additionalProjects
    )
      ? source.additionalProjects
      : [],

    customSections: Array.isArray(source.customSections)
      ? source.customSections
      : [],

    sectionStyles: {
      ...defaultResume.sectionStyles,
      ...(source.sectionStyles || {}),
    },
  };
}

/* =========================
   LOAD RESUME
========================= */

function getSelectedResume() {
  try {
    const selected = localStorage.getItem(
      "resumeProSelectedResume"
    );

    if (!selected) {
      return null;
    }

    return JSON.parse(selected);
  } catch (error) {
    console.error("Selected resume error:", error);
    return null;
  }
}

function loadResume() {
  const currentUser = getCurrentUser();

  /* Editing a multiple-resume item */
  if (currentUser) {
    try {
      const editingId = localStorage.getItem(
        "resumeProEditingResumeId"
      );

      if (editingId) {
        const users = JSON.parse(
          localStorage.getItem("resumeProUsers") || "[]"
        );

        const user = users.find(
          (item) => item.email === currentUser.email
        );

        if (user && Array.isArray(user.resumes)) {
          const selected = user.resumes.find(
            (item) => String(item.id) === String(editingId)
          );

          if (selected) {
            return prepareResume(selected);
          }
        }
      }
    } catch (error) {
      console.error("Multiple resume load error:", error);
    }
  }

  /* Selected template / selected resume */
  const selectedResume = getSelectedResume();

  if (selectedResume) {
    return prepareResume(selectedResume);
  }

  /* Logged-in user's main resume */
  if (currentUser && currentUser.resume) {
    return prepareResume(currentUser.resume);
  }

  /* Guest draft */
  const guestResume = getGuestResume();

  if (guestResume) {
    return prepareResume(guestResume);
  }

  /* Old storage support */
  try {
    const oldData = localStorage.getItem("resumeProData");

    if (oldData) {
      return prepareResume(JSON.parse(oldData));
    }
  } catch (error) {
    console.error("Old resume data error:", error);
  }

  return prepareResume(defaultResume);
}

/* =========================
   SECTION STYLE
========================= */

function updateSectionStyle(
  resume,
  section,
  property,
  value
) {
  return {
    ...resume,
    sectionStyles: {
      ...resume.sectionStyles,
      [section]: {
        ...resume.sectionStyles[section],
        [property]: value,
      },
    },
  };
}

/* =========================
   FONT CONTROLS
========================= */

function FontControls({
  resume,
  setResume,
  section,
  title,
}) {
  const style =
    resume.sectionStyles?.[section] ||
    defaultResume.sectionStyles[section];

  return (
    <div className="font-controls">
      <strong>{title} Font</strong>

      <select
        value={style.fontFamily}
        onChange={(e) =>
          setResume((prev) =>
            updateSectionStyle(
              prev,
              section,
              "fontFamily",
              e.target.value
            )
          )
        }
      >
        <option value="Arial">Arial</option>
        <option value="Calibri">Calibri</option>
        <option value="Georgia">Georgia</option>
        <option value="Times New Roman">
          Times New Roman
        </option>
        <option value="Verdana">Verdana</option>
        <option value="Tahoma">Tahoma</option>
      </select>

      <select
        value={style.fontSize}
        onChange={(e) =>
          setResume((prev) =>
            updateSectionStyle(
              prev,
              section,
              "fontSize",
              Number(e.target.value)
            )
          )
        }
      >
        <option value={10}>10px</option>
        <option value={11}>11px</option>
        <option value={12}>12px</option>
        <option value={13}>13px</option>
        <option value={14}>14px</option>
        <option value={15}>15px</option>
        <option value={16}>16px</option>
        <option value={18}>18px</option>
        <option value={20}>20px</option>
      </select>
    </div>
  );
}

/* =========================
   BUILDER
========================= */

function Builder() {
  const navigate = useNavigate();

  const [resume, setResume] = useState(loadResume);
  const [currentUser, setCurrentUser] =
    useState(getCurrentUser);

  const [selectedTemplate, setSelectedTemplate] =
    useState(
      localStorage.getItem("resumeProSelectedTemplate") ||
        "modern"
    );

  useEffect(() => {
    const savedTemplate =
      localStorage.getItem("resumeProSelectedTemplate");

    if (savedTemplate) {
      setSelectedTemplate(savedTemplate);
    }
  }, []);

  const [activeSection, setActiveSection] =
    useState("personal");

  /* =========================
     AUTO SAVE
  ========================= */

  useEffect(() => {
    if (currentUser) {
      saveUserResume(resume);
    } else {
      saveGuestResume(resume);
    }

    try {
      localStorage.setItem(
        "resumeProATSResume",
        JSON.stringify(resume)
      );
    } catch (error) {
      console.error(
        "ATS resume save error:",
        error
      );
    }
  }, [resume, currentUser]);

  /* =========================
     FIELD UPDATE
  ========================= */

  const updateField = (field, value) => {
    setResume((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* =========================
     PHOTO
  ========================= */

  const handlePhoto = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setResume((prev) => ({
        ...prev,
        photo: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  /* =========================
     EDUCATION
  ========================= */

  const addEducation = () => {
    setResume((prev) => ({
      ...prev,
      educationEntries: [
        ...prev.educationEntries,
        {
          id: Date.now(),
          degree: "",
          college: "",
          year: "",
          score: "",
          scoreType: "CGPA",
        },
      ],
    }));
  };

  const updateEducation = (
    id,
    field,
    value
  ) => {
    setResume((prev) => ({
      ...prev,
      educationEntries:
        prev.educationEntries.map((item) =>
          item.id === id
            ? {
                ...item,
                [field]: value,
              }
            : item
        ),
    }));
  };

  const removeEducation = (id) => {
    setResume((prev) => ({
      ...prev,
      educationEntries:
        prev.educationEntries.filter(
          (item) => item.id !== id
        ),
    }));
  };

  /* =========================
     SKILLS
  ========================= */

  const addSkill = () => {
    setResume((prev) => ({
      ...prev,
      skillEntries: [
        ...prev.skillEntries,
        {
          id: Date.now(),
          name: "",
        },
      ],
    }));
  };

  const updateSkill = (id, value) => {
    setResume((prev) => ({
      ...prev,
      skillEntries: prev.skillEntries.map(
        (item) =>
          item.id === id
            ? {
                ...item,
                name: value,
              }
            : item
      ),
    }));
  };

  const removeSkill = (id) => {
    setResume((prev) => ({
      ...prev,
      skillEntries:
        prev.skillEntries.filter(
          (item) => item.id !== id
        ),
    }));
  };

  /* =========================
     PROJECTS
  ========================= */

  const addProject = () => {
    setResume((prev) => ({
      ...prev,
      additionalProjects: [
        ...prev.additionalProjects,
        {
          id: Date.now(),
          name: "",
          description: "",
        },
      ],
    }));
  };

  const updateProject = (
    id,
    field,
    value
  ) => {
    setResume((prev) => ({
      ...prev,
      additionalProjects:
        prev.additionalProjects.map(
          (item) =>
            item.id === id
              ? {
                  ...item,
                  [field]: value,
                }
              : item
        ),
    }));
  };

  const removeProject = (id) => {
    setResume((prev) => ({
      ...prev,
      additionalProjects:
        prev.additionalProjects.filter(
          (item) => item.id !== id
        ),
    }));
  };

  /* =========================
     CUSTOM SECTIONS
  ========================= */

  const addCustomSection = () => {
    setResume((prev) => ({
      ...prev,
      customSections: [
        ...prev.customSections,
        {
          id: Date.now(),
          title: "New Section",
          content: "",
        },
      ],
    }));
  };

  const updateCustomSection = (
    id,
    field,
    value
  ) => {
    setResume((prev) => ({
      ...prev,
      customSections:
        prev.customSections.map(
          (item) =>
            item.id === id
              ? {
                  ...item,
                  [field]: value,
                }
              : item
        ),
    }));
  };

  const removeCustomSection = (id) => {
    setResume((prev) => ({
      ...prev,
      customSections:
        prev.customSections.filter(
          (item) => item.id !== id
        ),
    }));
  };

  /* =========================
     SECTION VISIBILITY
  ========================= */

  const toggleSection = (section) => {
    setResume((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  /* =========================
     SAVE
  ========================= */

  const handleSave = () => {
    if (currentUser) {
      saveUserResume(resume);
      alert("Resume saved successfully!");
    } else {
      saveGuestResume(resume);
      alert(
        "Resume saved temporarily. Login to keep it permanently."
      );
    }
  };

  /* =========================
     CLEAR
  ========================= */

  const handleClear = () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear this resume?"
    );

    if (!confirmClear) {
      return;
    }

    setResume(prepareResume(defaultResume));

    localStorage.removeItem(
      "resumeProEditingResumeId"
    );

    localStorage.removeItem(
      "resumeProSelectedResume"
    );

    if (currentUser) {
      const users = JSON.parse(
        localStorage.getItem(
          "resumeProUsers"
        ) || "[]"
      );

      const updatedUsers = users.map(
        (user) =>
          user.email === currentUser.email
            ? {
                ...user,
                resume: prepareResume(
                  defaultResume
                ),
              }
            : user
      );

      localStorage.setItem(
        "resumeProUsers",
        JSON.stringify(updatedUsers)
      );
    } else {
      sessionStorage.removeItem(
        "resumeProGuestDraft"
      );
    }
  };

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {
    try {
      sessionStorage.setItem(
        "resumeProGuestDraft",
        JSON.stringify(resume)
      );
    } catch {
      // ignore
    }

    localStorage.removeItem(
      "resumeProCurrentUser"
    );

    setCurrentUser(null);

    alert(
      "You have been logged out. Your latest resume is kept as a temporary draft."
    );

    navigate("/");
  };

  /* =========================
     PRINT
  ========================= */

  const handlePrint = () => {
    window.print();
  };

  /* =========================
     DOCX DOWNLOAD
  ========================= */

  const handleDownloadDocx = async () => {
    try {
      const {
        Document,
        Packer,
        Paragraph,
        TextRun,
      } = await import("docx");

      const children = [];

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: resume.name || "My Resume",
              bold: true,
              size: 32,
            }),
          ],
        })
      );

      if (resume.role) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: resume.role,
                bold: true,
                size: 24,
              }),
            ],
          })
        );
      }

      const contact = [
        resume.email,
        resume.phone,
        resume.location,
      ]
        .filter(Boolean)
        .join(" | ");

      if (contact) {
        children.push(
          new Paragraph(contact)
        );
      }

      if (
        resume.showSummary &&
        resume.summary
      ) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "SUMMARY",
                bold: true,
              }),
            ],
          })
        );

        children.push(
          new Paragraph(resume.summary)
        );
      }

      if (
        resume.showEducation &&
        resume.educationEntries.length
      ) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "EDUCATION",
                bold: true,
              }),
            ],
          })
        );

        resume.educationEntries.forEach(
          (item) => {
            const score = item.score
              ? `${item.scoreType || "CGPA"}: ${item.score}`
              : "";

            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: item.degree || "",
                    bold: true,
                  }),
                ],
              })
            );

            children.push(
              new Paragraph(
                [
                  item.college,
                  item.year,
                  score,
                ]
                  .filter(Boolean)
                  .join(" | ")
              )
            );
          }
        );
      }

      if (
        resume.showExperience &&
        resume.experience
      ) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "EXPERIENCE",
                bold: true,
              }),
            ],
          })
        );

        children.push(
          new Paragraph(resume.experience)
        );
      }

      if (
        resume.showProjects &&
        (resume.projectName ||
          resume.projectDescription ||
          resume.additionalProjects.length)
      ) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "PROJECTS",
                bold: true,
              }),
            ],
          })
        );

        if (resume.projectName) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: resume.projectName,
                  bold: true,
                }),
              ],
            })
          );
        }

        if (resume.projectDescription) {
          children.push(
            new Paragraph(
              resume.projectDescription
            )
          );
        }

        resume.additionalProjects.forEach(
          (project) => {
            if (project.name) {
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: project.name,
                      bold: true,
                    }),
                  ],
                })
              );
            }

            if (project.description) {
              children.push(
                new Paragraph(
                  project.description
                )
              );
            }
          }
        );
      }

      if (
        resume.showSkills &&
        resume.skillEntries.length
      ) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "SKILLS",
                bold: true,
              }),
            ],
          })
        );

        children.push(
          new Paragraph(
            resume.skillEntries
              .map((item) => item.name)
              .filter(Boolean)
              .join(", ")
          )
        );
      }

      resume.customSections.forEach(
        (section) => {
          if (
            section.title ||
            section.content
          ) {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text:
                      section.title ||
                      "SECTION",
                    bold: true,
                  }),
                ],
              })
            );

            children.push(
              new Paragraph(
                section.content || ""
              )
            );
          }
        }
      );

      const doc = new Document({
        sections: [
          {
            children,
          },
        ],
      });

      const blob =
        await Packer.toBlob(doc);

      const link =
        window.document.createElement(
          "a"
        );

      link.href =
        window.URL.createObjectURL(blob);

      link.download =
        `${resume.name || "Resume"}.docx`;

      link.click();

      window.URL.revokeObjectURL(
        link.href
      );
    } catch (error) {
      console.error(
        "DOCX download error:",
        error
      );

      alert(
        "DOCX download failed. Please make sure the docx package is installed."
      );
    }
  };

  /* =========================
     PREVIEW HELPERS
  ========================= */

  const getSkillsForPreview = () => {
    const arraySkills =
      resume.skillEntries
        .map((item) => item.name)
        .filter(Boolean);

    if (arraySkills.length) {
      return arraySkills;
    }

    return resume.skills
      ? resume.skills
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];
  };

  const getEducationForPreview = () => {
    if (resume.educationEntries.length) {
      return resume.educationEntries;
    }

    if (
      resume.education ||
      resume.college ||
      resume.year
    ) {
      return [
        {
          id: "old-education",
          degree: resume.education,
          college: resume.college,
          year: resume.year,
          score: "",
          scoreType: "CGPA",
        },
      ];
    }

    return [];
  };

  const skills = getSkillsForPreview();
  const education = getEducationForPreview();

  /* =========================
     STYLE OBJECTS
  ========================= */

  const personalStyle =
    resume.sectionStyles.personal;

  const summaryStyle =
    resume.sectionStyles.summary;

  const educationStyle =
    resume.sectionStyles.education;

  const experienceStyle =
    resume.sectionStyles.experience;

  const projectsStyle =
    resume.sectionStyles.projects;

  const skillsStyle =
    resume.sectionStyles.skills;

  const customStyle =
    resume.sectionStyles.custom;

  return (
    <div className="builder-page">
      {/* =========================
          TOP BAR
      ========================= */}

      <header className="builder-topbar">
        <div className="builder-brand">
          <button
            className="icon-btn"
            onClick={() => navigate("/")}
            title="Home"
          >
            <Home size={20} />
          </button>

          <button
            className="icon-btn"
            onClick={() =>
              navigate("/templates")
            }
            title="Back"
          >
            <ArrowLeft size={20} />
          </button>

          <h1>Resume Builder</h1>
        </div>

        <div className="builder-actions">
          <button
            className="secondary-btn"
            onClick={handleSave}
          >
            <Save size={17} />
            Save
          </button>

          <button
            className="secondary-btn"
            onClick={handlePrint}
          >
            <Printer size={17} />
            Print / PDF
          </button>

          <button
            className="secondary-btn"
            onClick={handleDownloadDocx}
          >
            <Download size={17} />
            DOCX
          </button>

          {currentUser ? (
            <button
              className="secondary-btn"
              onClick={handleLogout}
            >
              <LogOut size={17} />
              Logout
            </button>
          ) : (
            <button
              className="primary-btn"
              onClick={() =>
                navigate("/login")
              }
            >
              <LogIn size={17} />
              Login
            </button>
          )}
        </div>
      </header>

      {/* =========================
          MAIN
      ========================= */}

      <main className="builder-layout">
        {/* =========================
            LEFT PANEL
        ========================= */}

        <section className="builder-editor">
          <div className="builder-heading">
            <div>
              <h2>Build your resume</h2>

              <p>
                Fill the details and see your
                resume update instantly.
              </p>
            </div>

            <button
              className="danger-btn"
              onClick={handleClear}
            >
              <Trash2 size={17} />
              Clear
            </button>
          </div>

          {/* =========================
              SECTION NAVIGATION
          ========================= */}

          <div className="builder-tabs">
            <button
              className={
                activeSection === "personal"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveSection("personal")
              }
            >
              Personal
            </button>

            <button
              className={
                activeSection === "summary"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveSection("summary")
              }
            >
              Summary
            </button>

            <button
              className={
                activeSection === "education"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveSection("education")
              }
            >
              Education
            </button>

            <button
              className={
                activeSection === "experience"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveSection("experience")
              }
            >
              Experience
            </button>

            <button
              className={
                activeSection === "projects"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveSection("projects")
              }
            >
              Projects
            </button>

            <button
              className={
                activeSection === "skills"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveSection("skills")
              }
            >
              Skills
            </button>

            <button
              className={
                activeSection === "custom"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveSection("custom")
              }
            >
              Custom
            </button>
          </div>

          {/* =========================
              PERSONAL
          ========================= */}

          {activeSection === "personal" && (
            <div className="editor-card">
              <div className="card-title">
                <div>
                  <h3>Personal Details</h3>
                  <p>
                    Add your basic contact
                    information.
                  </p>
                </div>

                <Camera size={22} />
              </div>

              <div className="photo-upload">
                {resume.photo ? (
                  <img
                    src={resume.photo}
                    alt="Profile"
                    className="profile-upload-preview"
                  />
                ) : (
                  <div className="photo-placeholder">
                    <Camera size={30} />
                  </div>
                )}

                <label className="upload-btn">
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhoto}
                    hidden
                  />
                </label>

                {resume.photo && (
                  <button
                    className="small-danger"
                    onClick={() =>
                      updateField(
                        "photo",
                        ""
                      )
                    }
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>

                  <input
                    value={resume.name}
                    onChange={(e) =>
                      updateField(
                        "name",
                        e.target.value
                      )
                    }
                    placeholder="Your Name "
                  />
                </div>

                <div className="form-group">
                  <label>Job Title / Role</label>

                  <input
                    value={resume.role}
                    onChange={(e) =>
                      updateField(
                        "role",
                        e.target.value
                      )
                    }
                    placeholder="Software Developer"
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>

                  <input
                    type="email"
                    value={resume.email}
                    onChange={(e) =>
                      updateField(
                        "email",
                        e.target.value
                      )
                    }
                    placeholder="your@email.com"
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>

                  <input
                    value={resume.phone}
                    onChange={(e) =>
                      updateField(
                        "phone",
                        e.target.value
                      )
                    }
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                <div className="form-group full">
                  <label>Location</label>

                  <input
                    value={resume.location}
                    onChange={(e) =>
                      updateField(
                        "location",
                        e.target.value
                      )
                    }
                    placeholder="Vijayawada, Andhra Pradesh"
                  />
                </div>
              </div>

              <FontControls
                resume={resume}
                setResume={setResume}
                section="personal"
                title="Personal"
              />
            </div>
          )}

          {/* =========================
              SUMMARY
          ========================= */}

          {activeSection === "summary" && (
            <div className="editor-card">
              <div className="card-title">
                <div>
                  <h3>Professional Summary</h3>

                  <p>
                    Write a short introduction
                    about yourself.
                  </p>
                </div>

                <button
                  className="visibility-btn"
                  onClick={() =>
                    toggleSection(
                      "showSummary"
                    )
                  }
                >
                  {resume.showSummary
                    ? "Hide"
                    : "Show"}
                </button>
              </div>

              <div className="form-group">
                <label>Summary</label>

                <textarea
                  rows="8"
                  value={resume.summary}
                  onChange={(e) =>
                    updateField(
                      "summary",
                      e.target.value
                    )
                  }
                  placeholder="Motivated B.Tech student with interest in software development, AI and web technologies..."
                />
              </div>

              <FontControls
                resume={resume}
                setResume={setResume}
                section="summary"
                title="Summary"
              />
            </div>
          )}

          {/* =========================
              EDUCATION
          ========================= */}

          {activeSection === "education" && (
            <div className="editor-card">
              <div className="card-title">
                <div>
                  <h3>Education</h3>

                  <p>
                    Add one or more educational
                    qualifications.
                  </p>
                </div>

                <button
                  className="visibility-btn"
                  onClick={() =>
                    toggleSection(
                      "showEducation"
                    )
                  }
                >
                  {resume.showEducation
                    ? "Hide"
                    : "Show"}
                </button>
              </div>

              {education.length === 0 &&
                resume.educationEntries
                  .length === 0 && (
                  <div className="empty-box">
                    No education added yet.
                  </div>
                )}

              {resume.educationEntries.map(
                (item, index) => (
                  <div
                    className="repeat-card"
                    key={item.id}
                  >
                    <div className="repeat-header">
                      <strong>
                        Education {index + 1}
                      </strong>

                      <button
                        className="remove-btn"
                        onClick={() =>
                          removeEducation(
                            item.id
                          )
                        }
                      >
                        <X size={17} />
                      </button>
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label>
                          Degree / Course
                        </label>

                        <input
                          value={
                            item.degree || ""
                          }
                          onChange={(e) =>
                            updateEducation(
                              item.id,
                              "degree",
                              e.target.value
                            )
                          }
                          placeholder="B.Tech CSE"
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          College / University
                        </label>

                        <input
                          value={
                            item.college || ""
                          }
                          onChange={(e) =>
                            updateEducation(
                              item.id,
                              "college",
                              e.target.value
                            )
                          }
                          placeholder="College Name"
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          Year
                        </label>

                        <input
                          value={
                            item.year || ""
                          }
                          onChange={(e) =>
                            updateEducation(
                              item.id,
                              "year",
                              e.target.value
                            )
                          }
                          placeholder="2023 - 2027"
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          Score
                        </label>

                        <div className="score-row">
                          <select
                            value={
                              item.scoreType ||
                              "CGPA"
                            }
                            onChange={(e) =>
                              updateEducation(
                                item.id,
                                "scoreType",
                                e.target.value
                              )
                            }
                          >
                            <option value="CGPA">
                              CGPA
                            </option>

                            <option value="%">
                              Percentage
                            </option>
                          </select>

                          <input
                            value={
                              item.score || ""
                            }
                            onChange={(e) =>
                              updateEducation(
                                item.id,
                                "score",
                                e.target.value
                              )
                            }
                            placeholder="8.9"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}

              <button
                className="add-btn"
                onClick={addEducation}
              >
                <Plus size={18} />
                Add Education
              </button>

              <FontControls
                resume={resume}
                setResume={setResume}
                section="education"
                title="Education"
              />
            </div>
          )}

          {/* =========================
              EXPERIENCE
          ========================= */}

          {activeSection === "experience" && (
            <div className="editor-card">
              <div className="card-title">
                <div>
                  <h3>Experience</h3>

                  <p>
                    Add internships, jobs or
                    relevant experience.
                  </p>
                </div>

                <button
                  className="visibility-btn"
                  onClick={() =>
                    toggleSection(
                      "showExperience"
                    )
                  }
                >
                  {resume.showExperience
                    ? "Hide"
                    : "Show"}
                </button>
              </div>

              <div className="form-group">
                <label>
                  Experience Details
                </label>

                <textarea
                  rows="10"
                  value={resume.experience}
                  onChange={(e) =>
                    updateField(
                      "experience",
                      e.target.value
                    )
                  }
                  placeholder={`Software Development Intern
Company Name
June 2026 - August 2026

• Worked on web application development
• Developed responsive UI
• Collaborated with team members`}
                />
              </div>

              <FontControls
                resume={resume}
                setResume={setResume}
                section="experience"
                title="Experience"
              />
            </div>
          )}

          {/* =========================
              PROJECTS
          ========================= */}

          {activeSection === "projects" && (
            <div className="editor-card">
              <div className="card-title">
                <div>
                  <h3>Projects</h3>

                  <p>
                    Add your important academic
                    or personal projects.
                  </p>
                </div>

                <button
                  className="visibility-btn"
                  onClick={() =>
                    toggleSection(
                      "showProjects"
                    )
                  }
                >
                  {resume.showProjects
                    ? "Hide"
                    : "Show"}
                </button>
              </div>

              <div className="repeat-card">
                <div className="repeat-header">
                  <strong>
                    Main Project
                  </strong>
                </div>

                <div className="form-group">
                  <label>
                    Project Name
                  </label>

                  <input
                    value={
                      resume.projectName
                    }
                    onChange={(e) =>
                      updateField(
                        "projectName",
                        e.target.value
                      )
                    }
                    placeholder="Heart Disease Prediction"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Project Description
                  </label>

                  <textarea
                    rows="5"
                    value={
                      resume.projectDescription
                    }
                    onChange={(e) =>
                      updateField(
                        "projectDescription",
                        e.target.value
                      )
                    }
                    placeholder="Explain the project, technologies used and your contribution."
                  />
                </div>
              </div>

              {resume.additionalProjects.map(
                (project, index) => (
                  <div
                    className="repeat-card"
                    key={project.id}
                  >
                    <div className="repeat-header">
                      <strong>
                        Project {index + 2}
                      </strong>

                      <button
                        className="remove-btn"
                        onClick={() =>
                          removeProject(
                            project.id
                          )
                        }
                      >
                        <X size={17} />
                      </button>
                    </div>

                    <div className="form-group">
                      <label>
                        Project Name
                      </label>

                      <input
                        value={
                          project.name
                        }
                        onChange={(e) =>
                          updateProject(
                            project.id,
                            "name",
                            e.target.value
                          )
                        }
                        placeholder="Project name"
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        Description
                      </label>

                      <textarea
                        rows="5"
                        value={
                          project.description
                        }
                        onChange={(e) =>
                          updateProject(
                            project.id,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Project description"
                      />
                    </div>
                  </div>
                )
              )}

              <button
                className="add-btn"
                onClick={addProject}
              >
                <Plus size={18} />
                Add Project
              </button>

              <FontControls
                resume={resume}
                setResume={setResume}
                section="projects"
                title="Projects"
              />
            </div>
          )}

          {/* =========================
              SKILLS
          ========================= */}

          {activeSection === "skills" && (
            <div className="editor-card">
              <div className="card-title">
                <div>
                  <h3>Skills</h3>

                  <p>
                    Add technical and
                    professional skills.
                  </p>
                </div>

                <button
                  className="visibility-btn"
                  onClick={() =>
                    toggleSection(
                      "showSkills"
                    )
                  }
                >
                  {resume.showSkills
                    ? "Hide"
                    : "Show"}
                </button>
              </div>

              {resume.skillEntries.map(
                (skill, index) => (
                  <div
                    className="skill-row"
                    key={skill.id}
                  >
                    <span>
                      {index + 1}
                    </span>

                    <input
                      value={
                        skill.name
                      }
                      onChange={(e) =>
                        updateSkill(
                          skill.id,
                          e.target.value
                        )
                      }
                      placeholder="Java"
                    />

                    <button
                      className="remove-btn"
                      onClick={() =>
                        removeSkill(
                          skill.id
                        )
                      }
                    >
                      <X size={17} />
                    </button>
                  </div>
                )
              )}

              {resume.skillEntries
                .length === 0 && (
                <div className="empty-box">
                  No skills added yet.
                </div>
              )}

              <button
                className="add-btn"
                onClick={addSkill}
              >
                <Plus size={18} />
                Add Skill
              </button>

              <FontControls
                resume={resume}
                setResume={setResume}
                section="skills"
                title="Skills"
              />
            </div>
          )}

          {/* =========================
              CUSTOM SECTIONS
          ========================= */}

          {activeSection === "custom" && (
            <div className="editor-card">
              <div className="card-title">
                <div>
                  <h3>Custom Sections</h3>

                  <p>
                    Add certifications,
                    achievements, languages,
                    interests and more.
                  </p>
                </div>

                <FileText size={22} />
              </div>

              {resume.customSections.map(
                (section, index) => (
                  <div
                    className="repeat-card"
                    key={section.id}
                  >
                    <div className="repeat-header">
                      <strong>
                        Custom Section{" "}
                        {index + 1}
                      </strong>

                      <button
                        className="remove-btn"
                        onClick={() =>
                          removeCustomSection(
                            section.id
                          )
                        }
                      >
                        <X size={17} />
                      </button>
                    </div>

                    <div className="form-group">
                      <label>
                        Section Title
                      </label>

                      <input
                        value={
                          section.title
                        }
                        onChange={(e) =>
                          updateCustomSection(
                            section.id,
                            "title",
                            e.target.value
                          )
                        }
                        placeholder="Certifications"
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        Content
                      </label>

                      <textarea
                        rows="6"
                        value={
                          section.content
                        }
                        onChange={(e) =>
                          updateCustomSection(
                            section.id,
                            "content",
                            e.target.value
                          )
                        }
                        placeholder="Add your details..."
                      />
                    </div>
                  </div>
                )
              )}

              <button
                className="add-btn"
                onClick={addCustomSection}
              >
                <Plus size={18} />
                Add Custom Section
              </button>

              <FontControls
                resume={resume}
                setResume={setResume}
                section="custom"
                title="Custom"
              />
            </div>
          )}

          {/* =========================
              QUICK TOOLS
          ========================= */}

          <div className="quick-tools">
            <button
              onClick={() =>
                navigate("/ai-tools")
              }
            >
              <Sparkles size={18} />
              AI Resume Tools
            </button>

            <button
              onClick={() =>
                navigate("/job-match")
              }
            >
              <Target size={18} />
              Job Match
            </button>

            <button
              onClick={() =>
                navigate("/ats-checker")
              }
            >
              <ShieldCheck size={18} />
              ATS Checker
            </button>
          </div>
        </section>

        {/* =========================
            RIGHT PREVIEW
        ========================= */}

        <section className="builder-preview-area">
          <div className="preview-header">
            <div>
              <h2>Live Preview</h2>

              <p>
                Your resume updates
                automatically.
              </p>
            </div>

            <div className="preview-buttons">
              <button
                className="change-template-btn"
                onClick={() => navigate("/templates")}
                title="Change Template"
              >
                <FileText size={18} />
                Change Template
              </button>

              <button
                onClick={handlePrint}
                title="Print"
              >
                <Printer size={18} />
              </button>

              <button
                onClick={handleDownloadDocx}
                title="Download DOCX"
              >
                <Download size={18} />
              </button>
            </div>
          </div>

          <div className={`resume-paper template-${selectedTemplate}`}>
            {/* =========================
                RESUME HEADER
            ========================= */}

            <div
              className="resume-header"
              style={{
                fontFamily:
                  personalStyle.fontFamily,
                fontSize:
                  `${personalStyle.fontSize}px`,
              }}
            >
              {resume.photo && (
                <img
                  src={resume.photo}
                  alt="Profile"
                  className="resume-photo"
                />
              )}

              <div className="resume-heading">
                <h1>
                  {resume.name ||
                    "Your Name"}
                </h1>

                <h2>
                  {resume.role ||
                    "Professional Title"}
                </h2>

                <div className="contact-line">
                  {resume.email && (
                    <span>
                      {resume.email}
                    </span>
                  )}

                  {resume.phone && (
                    <span>
                      {resume.phone}
                    </span>
                  )}

                  {resume.location && (
                    <span>
                      {resume.location}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* =========================
                SUMMARY
            ========================= */}

            {resume.showSummary &&
              resume.summary && (
                <div
                  className="resume-section"
                  style={{
                    fontFamily:
                      summaryStyle.fontFamily,
                    fontSize:
                      `${summaryStyle.fontSize}px`,
                  }}
                >
                  <h3>SUMMARY</h3>

                  <p>
                    {resume.summary}
                  </p>
                </div>
              )}

            {/* =========================
                EDUCATION
            ========================= */}

            {resume.showEducation &&
              education.length > 0 && (
                <div
                  className="resume-section"
                  style={{
                    fontFamily:
                      educationStyle.fontFamily,
                    fontSize:
                      `${educationStyle.fontSize}px`,
                  }}
                >
                  <h3>EDUCATION</h3>

                  {education.map(
                    (item, index) => (
                      <div
                        className="resume-item"
                        key={
                          item.id ||
                          index
                        }
                      >
                        <div className="resume-item-top">
                          <strong>
                            {item.degree}
                          </strong>

                          {item.year && (
                            <span>
                              {item.year}
                            </span>
                          )}
                        </div>

                        {item.college && (
                          <div>
                            {item.college}
                          </div>
                        )}

                        {item.score && (
                          <div>
                            {
                              item.scoreType
                            }
                            : {item.score}
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}

            {/* =========================
                EXPERIENCE
            ========================= */}

            {resume.showExperience &&
              resume.experience && (
                <div
                  className="resume-section"
                  style={{
                    fontFamily:
                      experienceStyle.fontFamily,
                    fontSize:
                      `${experienceStyle.fontSize}px`,
                  }}
                >
                  <h3>EXPERIENCE</h3>

                  <div className="resume-text">
                    {resume.experience
                      .split("\n")
                      .map(
                        (line, index) => (
                          <p
                            key={index}
                          >
                            {line}
                          </p>
                        )
                      )}
                  </div>
                </div>
              )}

            {/* =========================
                PROJECTS
            ========================= */}

            {resume.showProjects &&
              (resume.projectName ||
                resume.projectDescription ||
                resume.additionalProjects
                  .length > 0) && (
                <div
                  className="resume-section"
                  style={{
                    fontFamily:
                      projectsStyle.fontFamily,
                    fontSize:
                      `${projectsStyle.fontSize}px`,
                  }}
                >
                  <h3>PROJECTS</h3>

                  {resume.projectName && (
                    <div className="resume-item">
                      <strong>
                        {resume.projectName}
                      </strong>

                      {resume.projectDescription && (
                        <p>
                          {
                            resume.projectDescription
                          }
                        </p>
                      )}
                    </div>
                  )}

                  {resume.additionalProjects.map(
                    (project) => (
                      <div
                        className="resume-item"
                        key={project.id}
                      >
                        {project.name && (
                          <strong>
                            {project.name}
                          </strong>
                        )}

                        {project.description && (
                          <p>
                            {
                              project.description
                            }
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}

            {/* =========================
                SKILLS
            ========================= */}

            {resume.showSkills &&
              skills.length > 0 && (
                <div
                  className="resume-section"
                  style={{
                    fontFamily:
                      skillsStyle.fontFamily,
                    fontSize:
                      `${skillsStyle.fontSize}px`,
                  }}
                >
                  <h3>SKILLS</h3>

                  <div className="skills-preview">
                    {skills.map(
                      (skill, index) => (
                        <span
                          key={index}
                          className="skill-tag"
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* =========================
                CUSTOM SECTIONS
            ========================= */}

            {resume.customSections.map(
              (section) =>
                (section.title ||
                  section.content) && (
                  <div
                    className="resume-section"
                    key={section.id}
                    style={{
                      fontFamily:
                        customStyle.fontFamily,
                      fontSize:
                        `${customStyle.fontSize}px`,
                    }}
                  >
                    <h3>
                      {section.title ||
                        "SECTION"}
                    </h3>

                    <div className="resume-text">
                      {(section.content ||
                        "")
                        .split("\n")
                        .map(
                          (
                            line,
                            index
                          ) => (
                            <p
                              key={
                                index
                              }
                            >
                              {line}
                            </p>
                          )
                        )}
                    </div>
                  </div>
                )
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Builder;