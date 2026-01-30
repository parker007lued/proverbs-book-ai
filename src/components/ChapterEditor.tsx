import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import ReactMarkdown from "react-markdown";
import "./ChapterEditor.css";

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

interface ChapterEditorProps {
  project: Project;
  selectedChapter: number | null;
  onChapterSelect: (chapter: number | null) => void;
  onChapterUpdate: (chapterNumber: number, chapter: Chapter) => void;
  onChapterAdd: (chapter: Chapter) => void;
  ollamaInstalled: boolean;
}

export default function ChapterEditor({
  project,
  selectedChapter,
  onChapterSelect,
  onChapterUpdate,
  onChapterAdd,
  ollamaInstalled,
}: ChapterEditorProps) {
  const [selectedChapterData, setSelectedChapterData] = useState<Chapter | null>(null);
  const [chapterNumber, setChapterNumber] = useState<number>(1);
  const [contentType, setContentType] = useState<"commentary" | "summary" | "devotional">("commentary");
  const [isGenerating, setIsGenerating] = useState(false);
  const [model, setModel] = useState("mistral:7b");
  const [customPrompt, setCustomPrompt] = useState("");
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (selectedChapter !== null) {
      const chapter = project.chapters.find((ch) => ch.number === selectedChapter);
      if (chapter) {
        setSelectedChapterData(chapter);
        setChapterNumber(chapter.number);
        setContentType(chapter.contentType as any || "commentary");
      }
    } else {
      setSelectedChapterData(null);
    }
  }, [selectedChapter, project.chapters]);

  const handleGenerate = async () => {
    if (!ollamaInstalled) {
      alert("Ollama is not installed. Please install it first.");
      return;
    }

    if (chapterNumber < 1 || chapterNumber > 31) {
      alert("Please enter a chapter number between 1 and 31");
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = customPrompt || `Write about Proverbs chapter ${chapterNumber}`;
      const generatedText = await invoke<string>("generate_text", {
        model,
        prompt,
        chapter: chapterNumber,
        contentType,
      });

      const newChapter: Chapter = {
        number: chapterNumber,
        title: `Proverbs Chapter ${chapterNumber}`,
        content: generatedText,
        images: [],
        contentType,
      };

      // Check if chapter already exists
      const existingChapter = project.chapters.find((ch) => ch.number === chapterNumber);
      if (existingChapter) {
        onChapterUpdate(chapterNumber, newChapter);
      } else {
        onChapterAdd(newChapter);
      }

      setSelectedChapterData(newChapter);
      onChapterSelect(chapterNumber);
    } catch (error) {
      console.error("Error generating text:", error);
      alert(`Error generating text: ${error}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleContentChange = (content: string) => {
    if (selectedChapterData) {
      const updated = { ...selectedChapterData, content };
      setSelectedChapterData(updated);
      onChapterUpdate(selectedChapterData.number, updated);
    }
  };

  const handleGenerateImage = async () => {
    if (!selectedChapterData) {
      alert("Please select or create a chapter first");
      return;
    }

    const imagePrompt = prompt("Enter a description for the image:");
    if (!imagePrompt) return;

    try {
      const result = await invoke<string>("generate_image", {
        prompt: imagePrompt,
        style: "illustration",
        chapter: selectedChapterData.number,
      });

      // In a real implementation, this would return an image path
      alert("Image generation would be implemented here. Result: " + result);
    } catch (error) {
      console.error("Error generating image:", error);
      alert(`Error generating image: ${error}`);
    }
  };

  return (
    <div className="chapter-editor">
      <div className="editor-sidebar">
        <div className="sidebar-section">
          <h3>Chapters</h3>
          <div className="chapter-list">
            {project.chapters.map((chapter) => (
              <div
                key={chapter.number}
                className={`chapter-item ${selectedChapter === chapter.number ? "active" : ""}`}
                onClick={() => onChapterSelect(chapter.number)}
              >
                <span className="chapter-number">Ch. {chapter.number}</span>
                <span className="chapter-title">{chapter.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-section">
          <h3>Create New Chapter</h3>
          <div className="form-group">
            <label>Chapter Number (1-31)</label>
            <input
              type="number"
              min="1"
              max="31"
              value={chapterNumber}
              onChange={(e) => setChapterNumber(parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="form-group">
            <label>Content Type</label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value as any)}
            >
              <option value="commentary">Commentary</option>
              <option value="summary">Summary</option>
              <option value="devotional">Devotional</option>
            </select>
          </div>
          <div className="form-group">
            <label>AI Model</label>
            <select value={model} onChange={(e) => setModel(e.target.value)}>
              <option value="mistral:7b">Mistral 7B</option>
              <option value="llama3.2:3b">Llama 3.2 3B</option>
              <option value="phi3:mini">Phi-3 Mini</option>
            </select>
          </div>
          <div className="form-group">
            <label>Custom Prompt (optional)</label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Additional context or instructions..."
              rows={3}
            />
          </div>
          <button
            className="generate-button"
            onClick={handleGenerate}
            disabled={isGenerating || !ollamaInstalled}
          >
            {isGenerating ? "Generating..." : "Generate Chapter"}
          </button>
        </div>
      </div>

      <div className="editor-main">
        {selectedChapterData ? (
          <>
            <div className="editor-toolbar">
              <h2>{selectedChapterData.title}</h2>
              <div className="toolbar-actions">
                <button
                  className="toolbar-button"
                  onClick={() => setPreviewMode(!previewMode)}
                >
                  {previewMode ? "Edit" : "Preview"}
                </button>
                <button
                  className="toolbar-button"
                  onClick={handleGenerateImage}
                >
                  Generate Image
                </button>
              </div>
            </div>
            <div className="editor-content">
              {previewMode ? (
                <div className="preview">
                  <ReactMarkdown>{selectedChapterData.content}</ReactMarkdown>
                </div>
              ) : (
                <textarea
                  className="content-editor"
                  value={selectedChapterData.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Chapter content will appear here..."
                />
              )}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <p>Select a chapter from the sidebar or create a new one</p>
          </div>
        )}
      </div>
    </div>
  );
}
