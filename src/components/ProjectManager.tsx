import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./ProjectManager.css";

interface Project {
  title: string;
  author: string;
  chapters: Chapter[];
}

interface Chapter {
  number: number;
  title: string;
  content: string;
  images: string[];
}

interface ProjectManagerProps {
  onProjectCreate: (project: Project) => void;
  onProjectLoad: (project: Project) => void;
}

export default function ProjectManager({ onProjectCreate, onProjectLoad }: ProjectManagerProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isCreating, setIsCreating] = useState(true);

  const handleCreate = () => {
    if (!title.trim() || !author.trim()) {
      alert("Please enter both title and author");
      return;
    }

    const newProject: Project = {
      title: title.trim(),
      author: author.trim(),
      chapters: [],
    };

    onProjectCreate(newProject);
  };

  return (
    <div className="project-manager">
      <div className="project-card">
        <h2>Create New Book Project</h2>
        <div className="form-group">
          <label>Book Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Reflections on Proverbs"
          />
        </div>
        <div className="form-group">
          <label>Author Name</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name"
          />
        </div>
        <button className="primary-button" onClick={handleCreate}>
          Create Project
        </button>
      </div>
    </div>
  );
}
