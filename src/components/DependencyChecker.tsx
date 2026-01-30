import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./DependencyChecker.css";

interface DependencyStatus {
  ollama: boolean;
  pandoc: boolean;
  python: boolean;
  python_packages: boolean;
}

export default function DependencyChecker() {
  const [status, setStatus] = useState<DependencyStatus | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [installing, setInstalling] = useState<string | null>(null);

  useEffect(() => {
    checkDependencies();
  }, []);

  const checkDependencies = async () => {
    setIsChecking(true);
    try {
      const deps = await invoke<DependencyStatus>("check_all_dependencies");
      setStatus(deps);
    } catch (error) {
      console.error("Error checking dependencies:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const installDependency = async (dep: "ollama" | "pandoc" | "python_packages") => {
    setInstalling(dep);
    try {
      let result: string;
      if (dep === "ollama") {
        result = await invoke<string>("install_ollama_auto");
      } else if (dep === "pandoc") {
        result = await invoke<string>("install_pandoc_auto");
      } else {
        result = await invoke<string>("install_python_packages_auto");
      }
      alert(result);
      // Recheck dependencies
      await checkDependencies();
    } catch (error) {
      console.error(`Error installing ${dep}:`, error);
      alert(`Installation failed: ${error}`);
    } finally {
      setInstalling(null);
    }
  };

  if (isChecking) {
    return (
      <div className="dependency-checker">
        <div className="checking">Checking dependencies...</div>
      </div>
    );
  }

  if (!status) {
    return null;
  }

  // If all dependencies are installed, don't show anything
  if (status.ollama && status.pandoc && status.python && status.python_packages) {
    return null;
  }

  return (
    <div className="dependency-checker">
      <div className="dependency-banner">
        <h3>Missing Dependencies</h3>
        <p>Some required dependencies are not installed. Install them automatically or manually.</p>
        
        <div className="dependency-list">
          {!status.ollama && (
            <div className="dependency-item">
              <span className="dependency-name">Ollama</span>
              <span className="dependency-status missing">Not Installed</span>
              <button
                className="install-button"
                onClick={() => installDependency("ollama")}
                disabled={installing === "ollama"}
              >
                {installing === "ollama" ? "Installing..." : "Install Automatically"}
              </button>
            </div>
          )}
          
          {!status.pandoc && (
            <div className="dependency-item">
              <span className="dependency-name">Pandoc</span>
              <span className="dependency-status missing">Not Installed</span>
              <button
                className="install-button"
                onClick={() => installDependency("pandoc")}
                disabled={installing === "pandoc"}
              >
                {installing === "pandoc" ? "Installing..." : "Install Automatically"}
              </button>
            </div>
          )}
          
          {!status.python && (
            <div className="dependency-item">
              <span className="dependency-name">Python</span>
              <span className="dependency-status missing">Not Installed</span>
              <span className="dependency-note">Please install Python 3.8+ manually</span>
            </div>
          )}
          
          {status.python && !status.python_packages && (
            <div className="dependency-item">
              <span className="dependency-name">Python Packages</span>
              <span className="dependency-status missing">Not Installed</span>
              <button
                className="install-button"
                onClick={() => installDependency("python_packages")}
                disabled={installing === "python_packages"}
              >
                {installing === "python_packages" ? "Installing..." : "Install Automatically"}
              </button>
            </div>
          )}
        </div>
        
        <button className="refresh-button" onClick={checkDependencies}>
          Refresh Status
        </button>
      </div>
    </div>
  );
}
