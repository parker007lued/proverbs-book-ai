import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import ProjectManager from "./components/ProjectManager";
import ChapterEditor from "./components/ChapterEditor";
import BookAssembler from "./components/BookAssembler";
import DependencyChecker from "./components/DependencyChecker";
import ModelManager from "./components/ModelManager";
import "./App.css";

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
  contentType?: string;
}

function App() {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [ollamaInstalled, setOllamaInstalled] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<"editor" | "assemble">("editor");

  useEffect(() => {
    // Check Ollama installation on startup
    checkOllama();
  }, []);

  const checkOllama = async () => {
    try {
      const installed = await invoke<boolean>("check_ollama_installed");
      setOllamaInstalled(installed);
    } catch (error) {
      console.error("Error checking Ollama:", error);
      setOllamaInstalled(false);
    }
  };

  const handleProjectCreate = (project: Project) => {
    setCurrentProject(project);
    setSelectedChapter(null);
  };

  const handleProjectLoad = (project: Project) => {
    setCurrentProject(project);
  };

  const handleChapterUpdate = (chapterNumber: number, updatedChapter: Chapter) => {
    if (!currentProject) return;
    
    const updatedChapters = currentProject.chapters.map((ch) =>
      ch.number === chapterNumber ? updatedChapter : ch
    );
    
    setCurrentProject({
      ...currentProject,
      chapters: updatedChapters,
    });
  };

  const handleChapterAdd = (chapter: Chapter) => {
    if (!currentProject) return;
    
    setCurrentProject({
      ...currentProject,
      chapters: [...currentProject.chapters, chapter],
    });
  };

  if (!currentProject) {
    return (
      <div className="app">
        <div className="app-header">
          <h1>Proverbs Book AI</h1>
          <p>Create and assemble your book about Proverbs chapters</p>
        </div>
        <DependencyChecker />
        <ModelManager />
        <ProjectManager
          onProjectCreate={handleProjectCreate}
          onProjectLoad={handleProjectLoad}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <div className="app-header">
        <h1>{currentProject.title}</h1>
        <div className="header-actions">
          <button
            className={activeTab === "editor" ? "active" : ""}
            onClick={() => setActiveTab("editor")}
          >
            Editor
          </button>
          <button
            className={activeTab === "assemble" ? "active" : ""}
            onClick={() => setActiveTab("assemble")}
          >
            Assemble Book
          </button>
        </div>
      </div>

      {activeTab === "editor" && (
        <ChapterEditor
          project={currentProject}
          selectedChapter={selectedChapter}
          onChapterSelect={setSelectedChapter}
          onChapterUpdate={handleChapterUpdate}
          onChapterAdd={handleChapterAdd}
          ollamaInstalled={ollamaInstalled === true}
        />
      )}

      {activeTab === "assemble" && (
        <BookAssembler
          project={currentProject}
        />
      )}
    </div>
  );
}

export default App;
