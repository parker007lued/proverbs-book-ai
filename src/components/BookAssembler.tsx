import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./BookAssembler.css";

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

interface BookAssemblerProps {
  project: Project;
}

export default function BookAssembler({ project }: BookAssemblerProps) {
  const [isAssembling, setIsAssembling] = useState(false);
  const [exportFormat, setExportFormat] = useState<"pdf" | "epub" | "both">("both");

  const handleAssemble = async () => {
    if (project.chapters.length === 0) {
      alert("Please create at least one chapter before assembling the book");
      return;
    }

    setIsAssembling(true);
    try {
      // Assemble the book content
      const markdown = await invoke<string>("assemble_book", {
        project: {
          title: project.title,
          author: project.author,
          chapters: project.chapters,
          cover_image: null,
        },
      });

      // Export based on selected format
      if (exportFormat === "pdf" || exportFormat === "both") {
        await invoke<string>("export_to_pdf", {
          markdownContent: markdown,
          outputPath: `${project.title.replace(/\s+/g, "_")}.pdf`,
        });
      }

      if (exportFormat === "epub" || exportFormat === "both") {
        await invoke<string>("export_to_epub", {
          markdownContent: markdown,
          outputPath: `${project.title.replace(/\s+/g, "_")}.epub`,
        });
      }

      alert("Book assembled successfully!");
    } catch (error) {
      console.error("Error assembling book:", error);
      alert(`Error assembling book: ${error}`);
    } finally {
      setIsAssembling(false);
    }
  };

  return (
    <div className="book-assembler">
      <div className="assembler-content">
        <h2>Assemble Your Book</h2>
        <div className="book-info">
          <div className="info-item">
            <strong>Title:</strong> {project.title}
          </div>
          <div className="info-item">
            <strong>Author:</strong> {project.author}
          </div>
          <div className="info-item">
            <strong>Chapters:</strong> {project.chapters.length}
          </div>
        </div>

        <div className="export-options">
          <h3>Export Format</h3>
          <div className="format-options">
            <label>
              <input
                type="radio"
                value="pdf"
                checked={exportFormat === "pdf"}
                onChange={(e) => setExportFormat(e.target.value as any)}
              />
              PDF Only
            </label>
            <label>
              <input
                type="radio"
                value="epub"
                checked={exportFormat === "epub"}
                onChange={(e) => setExportFormat(e.target.value as any)}
              />
              EPUB Only
            </label>
            <label>
              <input
                type="radio"
                value="both"
                checked={exportFormat === "both"}
                onChange={(e) => setExportFormat(e.target.value as any)}
              />
              Both PDF and EPUB
            </label>
          </div>
        </div>

        <div className="chapter-preview">
          <h3>Chapters in Book</h3>
          <div className="chapter-list">
            {project.chapters.length > 0 ? (
              project.chapters.map((chapter) => (
                <div key={chapter.number} className="chapter-preview-item">
                  <span className="chapter-num">Chapter {chapter.number}</span>
                  <span className="chapter-title">{chapter.title}</span>
                  <span className="chapter-stats">
                    {chapter.content.length} chars, {chapter.images.length} images
                  </span>
                </div>
              ))
            ) : (
              <p className="no-chapters">No chapters yet. Create chapters in the Editor tab.</p>
            )}
          </div>
        </div>

        <button
          className="assemble-button"
          onClick={handleAssemble}
          disabled={isAssembling || project.chapters.length === 0}
        >
          {isAssembling ? "Assembling..." : "Assemble and Export Book"}
        </button>
      </div>
    </div>
  );
}
