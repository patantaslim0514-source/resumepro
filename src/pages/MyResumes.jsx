
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  FileText,
  Edit3,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import "./MyResumes.css";

function MyResumes() {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = () => {
    try {
      const currentUser = JSON.parse(
        localStorage.getItem("resumeProCurrentUser") || "null"
      );

      if (!currentUser) {
        setResumes([]);
        return;
      }

      const users = JSON.parse(
        localStorage.getItem("resumeProUsers") || "[]"
      );

      const user = users.find(
        (item) => item.email === currentUser.email
      );

      if (!user) {
        setResumes([]);
        return;
      }

      if (Array.isArray(user.resumes)) {
        setResumes(user.resumes);
      } else if (user.resume) {
        setResumes([
          {
            id: Date.now(),
            title: user.resume.name
              ? `${user.resume.name}'s Resume`
              : "My Resume",
            data: user.resume,
          },
        ]);
      }
    } catch (error) {
      console.error("Resume loading error:", error);
    }
  };

  const createResume = () => {
    const title = window.prompt(
      "Enter a name for your resume:"
    );

    if (!title || !title.trim()) {
      return;
    }

    try {
      const currentUser = JSON.parse(
        localStorage.getItem("resumeProCurrentUser") || "null"
      );

      if (!currentUser) {
        alert("Please login first.");
        navigate("/login");
        return;
      }

      const users = JSON.parse(
        localStorage.getItem("resumeProUsers") || "[]"
      );

      const newResume = {
        id: Date.now(),
        title: title.trim(),
        data: {
          name: "",
          role: "",
          email: currentUser.email || "",
          phone: "",
          location: "",
          summary: "",
          educationEntries: [],
          skillEntries: [],
          experience: "",
          projectName: "",
          projectDescription: "",
          additionalProjects: [],
          customSections: [],
          showSummary: true,
          showEducation: true,
          showExperience: true,
          showProjects: true,
          showSkills: true,
        },
      };

      const updatedUsers = users.map((user) => {
        if (user.email !== currentUser.email) {
          return user;
        }

        const existingResumes = Array.isArray(user.resumes)
          ? user.resumes
          : [];

        return {
          ...user,
          resumes: [
            ...existingResumes,
            newResume,
          ],
        };
      });

      localStorage.setItem(
        "resumeProUsers",
        JSON.stringify(updatedUsers)
      );

      const updatedCurrentUser = {
        ...currentUser,
        resumes: [
          ...(Array.isArray(currentUser.resumes)
            ? currentUser.resumes
            : []),
          newResume,
        ],
      };

      localStorage.setItem(
        "resumeProCurrentUser",
        JSON.stringify(updatedCurrentUser)
      );

      setResumes((previous) => [
        ...previous,
        newResume,
      ]);
    } catch (error) {
      console.error(
        "Create resume error:",
        error
      );
    }
  };

  const editResume = (resume) => {
    localStorage.setItem(
      "resumeProEditingResumeId",
      String(resume.id)
    );

    localStorage.setItem(
      "resumeProSelectedResume",
      JSON.stringify(resume.data)
    );

    navigate("/builder");
  };

  const deleteResume = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resume?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const currentUser = JSON.parse(
        localStorage.getItem("resumeProCurrentUser") || "null"
      );

      if (!currentUser) {
        return;
      }

      const users = JSON.parse(
        localStorage.getItem("resumeProUsers") || "[]"
      );

      const updatedResumes = resumes.filter(
        (resume) => resume.id !== id
      );

      const updatedUsers = users.map((user) => {
        if (user.email !== currentUser.email) {
          return user;
        }

        return {
          ...user,
          resumes: updatedResumes,
        };
      });

      localStorage.setItem(
        "resumeProUsers",
        JSON.stringify(updatedUsers)
      );

      const updatedCurrentUser = {
        ...currentUser,
        resumes: updatedResumes,
      };

      localStorage.setItem(
        "resumeProCurrentUser",
        JSON.stringify(updatedCurrentUser)
      );

      setResumes(updatedResumes);
    } catch (error) {
      console.error(
        "Delete resume error:",
        error
      );
    }
  };

  return (
    <div className="my-resumes-page">

      <header className="my-resumes-header">

        <button
          className="back-btn"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={18} />
          Home
        </button>

        <div>
          <h1>My Resumes</h1>
          <p>
            Create and manage your resumes
          </p>
        </div>

        <button
          className="create-resume-btn"
          onClick={createResume}
        >
          <Plus size={18} />
          Create New Resume
        </button>

      </header>

      <main className="my-resumes-content">

        {resumes.length === 0 ? (
          <div className="empty-resumes">

            <FileText size={55} />

            <h2>
              No resumes yet
            </h2>

            <p>
              Create your first resume
              to get started.
            </p>

            <button
              onClick={createResume}
              className="create-resume-btn"
            >
              <Plus size={18} />
              Create Resume
            </button>

          </div>
        ) : (
          <div className="resume-grid">

            {resumes.map((resume) => (
              <div
                className="resume-card"
                key={resume.id}
              >

                <div className="resume-card-icon">
                  <FileText size={30} />
                </div>

                <div className="resume-card-info">

                  <h2>
                    {resume.title}
                  </h2>

                  <p>
                    {resume.data?.role ||
                      "Professional Resume"}
                  </p>

                  <span>
                    {resume.data?.email ||
                      "No email added"}
                  </span>

                </div>

                <div className="resume-card-actions">

                  <button
                    onClick={() =>
                      editResume(resume)
                    }
                  >
                    <Edit3 size={16} />
                    Edit
                  </button>

                  <button
                    className="delete-resume-btn"
                    onClick={() =>
                      deleteResume(resume.id)
                    }
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </main>

    </div>
  );
}

export default MyResumes;