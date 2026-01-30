import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./ModelManager.css";

interface ModelInfo {
  name: string;
  installed: boolean;
}

export default function ModelManager() {
  const [models, setModels] = useState<ModelInfo[]>([
    { name: "phi3:mini", installed: false },
    { name: "mistral:7b", installed: false },
    { name: "llama3.2:3b", installed: false },
  ]);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    checkModels();
  }, []);

  const checkModels = async () => {
    const updatedModels = await Promise.all(
      models.map(async (model) => {
        try {
          const installed = await invoke<boolean>("check_model_installed", {
            modelName: model.name,
          });
          return { ...model, installed };
        } catch {
          return { ...model, installed: false };
        }
      })
    );
    setModels(updatedModels);
  };

  const downloadModel = async (modelName: string) => {
    setDownloading(modelName);
    setStatus(`Downloading ${modelName}... This may take several minutes.`);
    try {
      const result = await invoke<string>("download_model", {
        modelName,
      });
      setStatus(result);
      await checkModels();
    } catch (error) {
      setStatus(`Error: ${error}`);
    } finally {
      setDownloading(null);
    }
  };

  const ensureDefaultModel = async () => {
    setStatus("Ensuring default model is installed...");
    try {
      const result = await invoke<string>("ensure_default_model");
      setStatus(result);
      await checkModels();
    } catch (error) {
      setStatus(`Error: ${error}`);
    }
  };

  return (
    <div className="model-manager">
      <div className="model-header">
        <h3>AI Models</h3>
        <button className="ensure-button" onClick={ensureDefaultModel}>
          Install Default Model
        </button>
      </div>
      
      {status && (
        <div className="status-message">{status}</div>
      )}
      
      <div className="model-list">
        {models.map((model) => (
          <div key={model.name} className="model-item">
            <div className="model-info">
              <span className="model-name">{model.name}</span>
              <span className={`model-status ${model.installed ? "installed" : "missing"}`}>
                {model.installed ? "✓ Installed" : "✗ Not Installed"}
              </span>
            </div>
            {!model.installed && (
              <button
                className="download-button"
                onClick={() => downloadModel(model.name)}
                disabled={downloading !== null}
              >
                {downloading === model.name ? "Downloading..." : "Download"}
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div className="model-info-text">
        <p><strong>Recommended:</strong> phi3:mini (smallest, fastest) or mistral:7b (best quality)</p>
        <p>Models are downloaded automatically on first use, or you can download them now.</p>
      </div>
    </div>
  );
}
