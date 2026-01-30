use std::process::Command;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct DependencyStatus {
    pub ollama: bool,
    pub pandoc: bool,
    pub python: bool,
    pub python_packages: bool,
}

#[tauri::command]
pub async fn check_all_dependencies() -> Result<DependencyStatus, String> {
    let ollama = check_ollama().await.unwrap_or(false);
    let pandoc = check_pandoc().await.unwrap_or(false);
    let python = check_python().await.unwrap_or(false);
    let python_packages = if python {
        check_python_packages().await.unwrap_or(false)
    } else {
        false
    };

    Ok(DependencyStatus {
        ollama,
        pandoc,
        python,
        python_packages,
    })
}

async fn check_ollama() -> Result<bool, String> {
    let output = if cfg!(target_os = "windows") {
        Command::new("ollama")
            .arg("--version")
            .output()
    } else {
        Command::new("sh")
            .arg("-c")
            .arg("which ollama")
            .output()
    };

    match output {
        Ok(output) => Ok(output.status.success()),
        Err(_) => Ok(false),
    }
}

async fn check_pandoc() -> Result<bool, String> {
    let output = Command::new("pandoc")
        .arg("--version")
        .output();

    match output {
        Ok(output) => Ok(output.status.success()),
        Err(_) => Ok(false),
    }
}

async fn check_python() -> Result<bool, String> {
    let python_cmd = if cfg!(target_os = "windows") {
        "python"
    } else {
        "python3"
    };

    let output = Command::new(python_cmd)
        .arg("--version")
        .output();

    match output {
        Ok(output) => Ok(output.status.success()),
        Err(_) => Ok(false),
    }
}

async fn check_python_packages() -> Result<bool, String> {
    let python_cmd = if cfg!(target_os = "windows") {
        "python"
    } else {
        "python3"
    };

    // Check if diffusers is installed
    let output = Command::new(python_cmd)
        .arg("-c")
        .arg("import diffusers; import torch; import PIL")
        .output();

    match output {
        Ok(output) => Ok(output.status.success()),
        Err(_) => Ok(false),
    }
}

#[tauri::command]
pub async fn install_ollama_auto() -> Result<String, String> {
    if cfg!(target_os = "windows") {
        // On Windows, we can't auto-install easily, so provide download link
        // In production, we could bundle the installer and run it
        Ok("Windows installation requires downloading the installer. Opening download page...".to_string())
    } else if cfg!(target_os = "macos") {
        // Try to install via brew if available
        let brew_check = Command::new("brew")
            .arg("--version")
            .output();
        
        if let Ok(output) = brew_check {
            if output.status.success() {
                // Install via brew
                let install = Command::new("brew")
                    .arg("install")
                    .arg("ollama")
                    .output();
                
                match install {
                    Ok(output) if output.status.success() => {
                        Ok("Ollama installed successfully via Homebrew".to_string())
                    }
                    Ok(output) => {
                        let stderr = String::from_utf8_lossy(&output.stderr);
                        Err(format!("Installation failed: {}", stderr))
                    }
                    Err(e) => Err(format!("Failed to run brew install: {}", e)),
                }
            } else {
                // Fallback to curl script
                install_ollama_curl().await
            }
        } else {
            // Fallback to curl script
            install_ollama_curl().await
        }
    } else {
        // Linux - use curl script
        install_ollama_curl().await
    }
}

async fn install_ollama_curl() -> Result<String, String> {
    let output = Command::new("sh")
        .arg("-c")
        .arg("curl -fsSL https://ollama.ai/install.sh | sh")
        .output();

    match output {
        Ok(output) if output.status.success() => {
            Ok("Ollama installed successfully".to_string())
        }
        Ok(output) => {
            let stderr = String::from_utf8_lossy(&output.stderr);
            Err(format!("Installation failed: {}", stderr))
        }
        Err(e) => Err(format!("Failed to run installation script: {}", e)),
    }
}

#[tauri::command]
pub async fn install_pandoc_auto() -> Result<String, String> {
    if cfg!(target_os = "windows") {
        Ok("Windows installation requires downloading the installer. Please visit https://pandoc.org/installing.html".to_string())
    } else if cfg!(target_os = "macos") {
        // Try brew first
        let brew_check = Command::new("brew")
            .arg("--version")
            .output();
        
        if let Ok(output) = brew_check {
            if output.status.success() {
                let install = Command::new("brew")
                    .arg("install")
                    .arg("pandoc")
                    .output();
                
                match install {
                    Ok(output) if output.status.success() => {
                        Ok("Pandoc installed successfully via Homebrew".to_string())
                    }
                    Ok(output) => {
                        let stderr = String::from_utf8_lossy(&output.stderr);
                        Err(format!("Installation failed: {}", stderr))
                    }
                    Err(e) => Err(format!("Failed to run brew install: {}", e)),
                }
            } else {
                Err("Homebrew not found. Please install Pandoc manually.".to_string())
            }
        } else {
            Err("Homebrew not found. Please install Pandoc manually.".to_string())
        }
    } else {
        // Linux - try apt-get
        let install = Command::new("sh")
            .arg("-c")
            .arg("sudo apt-get update && sudo apt-get install -y pandoc")
            .output();

        match install {
            Ok(output) if output.status.success() => {
                Ok("Pandoc installed successfully".to_string())
            }
            Ok(output) => {
                let stderr = String::from_utf8_lossy(&output.stderr);
                Err(format!("Installation failed: {}", stderr))
            }
            Err(e) => Err(format!("Failed to run apt-get: {}", e)),
        }
    }
}

#[tauri::command]
pub async fn install_python_packages_auto() -> Result<String, String> {
    let python_cmd = if cfg!(target_os = "windows") {
        "python"
    } else {
        "python3"
    };

    // Get the script directory
    let script_path = if cfg!(target_os = "windows") {
        "scripts\\requirements.txt"
    } else {
        "scripts/requirements.txt"
    };

    let install = Command::new(python_cmd)
        .arg("-m")
        .arg("pip")
        .arg("install")
        .arg("-r")
        .arg(script_path)
        .output();

    match install {
        Ok(output) if output.status.success() => {
            Ok("Python packages installed successfully".to_string())
        }
        Ok(output) => {
            let stderr = String::from_utf8_lossy(&output.stderr);
            Err(format!("Installation failed: {}", stderr))
        }
        Err(e) => Err(format!("Failed to run pip install: {}", e)),
    }
}
