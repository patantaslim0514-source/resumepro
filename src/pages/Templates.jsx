
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  FileText,
  Sparkles,
} from "lucide-react";
import "./Templates.css";

const templates = [
  {
    id: "modern",
    name: "Modern",
    category: "Modern",
    description: "Clean two-column design for modern professionals.",
  },
  {
    id: "professional",
    name: "Professional",
    category: "Professional",
    description: "Formal corporate style for professional applications.",
  },
  {
    id: "minimal",
    name: "Minimal",
    category: "Minimal",
    description: "Simple and spacious design with elegant typography.",
  },
  {
    id: "ats-pro",
    name: "ATS Pro",
    category: "ATS Friendly",
    description: "Simple structure designed for ATS readability.",
  },
  {
    id: "student",
    name: "Student",
    category: "Student",
    description: "Fresher-friendly layout for students and graduates.",
  },
  {
    id: "creative",
    name: "Creative",
    category: "Creative",
    description: "Eye-catching sidebar design for creative profiles.",
  },
  {
    id: "academic",
    name: "Academic",
    category: "Academic",
    description: "Education and research-focused resume layout.",
  },
  {
    id: "executive",
    name: "Executive",
    category: "Professional",
    description: "Premium style for experienced professionals.",
  },
];

const categories = [
  "All",
  "ATS Friendly",
  "Professional",
  "Modern",
  "Minimal",
  "Creative",
  "Student",
  "Academic",
];

function MiniResume({ template }) {
  return (
    <div className={`mini-resume mini-${template.id}`}>

      <div className="mini-header">
        <div className="mini-photo"></div>

        <div className="mini-heading">
          <div className="mini-name">YOUR NAME</div>
          <div className="mini-role">Software Developer</div>
          <div className="mini-contact">
            email@example.com • +91 9876543210
          </div>
        </div>
      </div>

      <div className="mini-body">

        <div className="mini-sidebar">
          <MiniSection title="CONTACT" />
          <MiniSection title="SKILLS" />
          <MiniSection title="LANGUAGES" />
        </div>

        <div className="mini-main">
          <MiniSection title="PROFILE" lines={3} />
          <MiniSection title="EDUCATION" lines={3} />
          <MiniSection title="EXPERIENCE" lines={4} />
          <MiniSection title="PROJECTS" lines={4} />
        </div>

      </div>
    </div>
  );
}

function MiniSection({ title, lines = 2 }) {
  return (
    <div className="mini-section">
      <div className="mini-section-title">{title}</div>

      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="mini-line"
          style={{
            width: `${70 + ((index * 13) % 25)}%`,
          }}
        />
      ))}
    </div>
  );
}

export default function Templates() {
  const navigate = useNavigate();

  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const saved = localStorage.getItem("resumeProSelectedTemplate");

    if (saved) {
      setSelectedTemplate(saved);
    }
  }, []);

  const filteredTemplates =
    activeCategory === "All"
      ? templates
      : templates.filter(
          (template) => template.category === activeCategory
        );

  const handleUseTemplate = (templateId) => {
    localStorage.setItem(
      "resumeProSelectedTemplate",
      templateId
    );

    setSelectedTemplate(templateId);

    navigate("/builder");
  };

  return (
    <div className="templates-page">

      {/* HEADER */}
      <header className="templates-header">

        <Link to="/" className="templates-logo">
          <div className="logo-icon">
            <FileText size={20} />
          </div>

          <span>ResumePro</span>
        </Link>

        <div className="templates-header-actions">
          <Link to="/" className="templates-back">
            <ArrowLeft size={17} />
            Home
          </Link>

          <button
            className="templates-create-btn"
            onClick={() => navigate("/builder")}
          >
            Create Resume
          </button>
        </div>

      </header>


      {/* HERO */}
      <section className="templates-hero">

        <div className="templates-hero-icon">
          <Sparkles size={22} />
        </div>

        <h1>
          Choose Your Resume Template
        </h1>

        <p>
          Select a professional design and start building
          your resume in minutes.
        </p>

      </section>


      {/* CATEGORY FILTER */}
      <div className="template-categories">

        {categories.map((category) => (
          <button
            key={category}
            className={
              activeCategory === category
                ? "category-btn active"
                : "category-btn"
            }
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}

      </div>


      {/* TEMPLATE GRID */}
      <main className="templates-container">

        <div className="templates-grid">

          {filteredTemplates.map((template) => (

            <div
              key={template.id}
              className={
                selectedTemplate === template.id
                  ? "template-card selected"
                  : "template-card"
              }
            >

              {/* SELECTED BADGE */}
              {selectedTemplate === template.id && (
                <div className="selected-badge">
                  <Check size={14} />
                  Selected
                </div>
              )}


              {/* PREVIEW */}
              <div className="template-preview-wrapper">

                <MiniResume template={template} />

              </div>


              {/* INFORMATION */}
              <div className="template-info">

                <div>
                  <h3>{template.name}</h3>

                  <span className="template-category">
                    {template.category}
                  </span>
                </div>

                <p>
                  {template.description}
                </p>

                <button
                  className="use-template-btn"
                  onClick={() =>
                    handleUseTemplate(template.id)
                  }
                >
                  Use This Template
                </button>

              </div>

            </div>

          ))}

        </div>

      </main>

    </div>
  );
}