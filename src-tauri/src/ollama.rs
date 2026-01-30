use serde::{Deserialize, Serialize};
use std::process::Command;
use tokio::time::{sleep, Duration};

#[derive(Serialize, Deserialize)]
pub struct OllamaResponse {
    pub model: String,
    pub created_at: String,
    pub response: String,
    pub done: bool,
}

const OLLAMA_BASE_URL: &str = "http://localhost:11434";

async fn check_ollama_internal() -> Result<bool, String> {
    // Check if Ollama is installed by trying to run it
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

#[tauri::command]
pub async fn check_ollama_installed() -> Result<bool, String> {
    check_ollama_internal().await
}

#[tauri::command]
pub async fn install_ollama() -> Result<String, String> {
    // Provide instructions for installing Ollama
    let instructions = if cfg!(target_os = "windows") {
        "Please download and install Ollama from https://ollama.ai/download/windows"
    } else if cfg!(target_os = "macos") {
        "Please install Ollama using: brew install ollama or download from https://ollama.ai/download/mac"
    } else {
        "Please install Ollama using: curl -fsSL https://ollama.ai/install.sh | sh"
    };
    
    Ok(instructions.to_string())
}

#[tauri::command]
pub async fn download_model(model_name: &str) -> Result<String, String> {
    // First check if Ollama is running
    let client = reqwest::Client::new();
    
    // Check if Ollama service is running
    let health_check = client
        .get(&format!("{}/api/tags", OLLAMA_BASE_URL))
        .send()
        .await;
    
    if health_check.is_err() {
        // Try to start Ollama service
        if cfg!(target_os = "windows") {
            let _ = std::process::Command::new("ollama")
                .arg("serve")
                .spawn();
        } else {
            let _ = std::process::Command::new("sh")
                .arg("-c")
                .arg("ollama serve &")
                .spawn();
        }
        
        // Wait a bit for service to start
        tokio::time::sleep(tokio::time::Duration::from_secs(3)).await;
    }
    
    let url = format!("{}/api/pull", OLLAMA_BASE_URL);
    
    let response = client
        .post(&url)
        .json(&serde_json::json!({
            "name": model_name
        }))
        .send()
        .await
        .map_err(|e| format!("Failed to download model: {}", e))?;
    
    if response.status().is_success() {
        Ok(format!("Model {} download started. This may take several minutes.", model_name))
    } else {
        Err(format!("Failed to start model download: {}", response.status()))
    }
}

#[tauri::command]
pub async fn check_model_installed(model_name: &str) -> Result<bool, String> {
    let client = reqwest::Client::new();
    let url = format!("{}/api/tags", OLLAMA_BASE_URL);
    
    let response = client
        .get(&url)
        .send()
        .await
        .map_err(|e| format!("Failed to check models: {}", e))?;
    
    if response.status().is_success() {
        let models: serde_json::Value = response
            .json()
            .await
            .map_err(|e| format!("Failed to parse models: {}", e))?;
        
        if let Some(models_array) = models.get("models").and_then(|m| m.as_array()) {
            for model in models_array {
                if let Some(name) = model.get("name").and_then(|n| n.as_str()) {
                    if name == model_name || name.starts_with(&format!("{}:", model_name)) {
                        return Ok(true);
                    }
                }
            }
        }
        Ok(false)
    } else {
        Ok(false)
    }
}

#[tauri::command]
pub async fn ensure_default_model() -> Result<String, String> {
    // Check if any model is installed, if not, download a lightweight default
    let client = reqwest::Client::new();
    let url = format!("{}/api/tags", OLLAMA_BASE_URL);
    
    let response = client
        .get(&url)
        .send()
        .await;
    
    let has_models = if let Ok(resp) = response {
        if resp.status().is_success() {
            if let Ok(models) = resp.json::<serde_json::Value>().await {
                if let Some(models_array) = models.get("models").and_then(|m| m.as_array()) {
                    !models_array.is_empty()
                } else {
                    false
                }
            } else {
                false
            }
        } else {
            false
        }
    } else {
        false
    };
    
    if !has_models {
        // Download a lightweight default model (Phi-3 Mini is very small and fast)
        download_model("phi3:mini").await
    } else {
        Ok("Models already installed".to_string())
    }
}

#[tauri::command]
pub async fn generate_text(
    model: &str,
    prompt: &str,
    chapter: u32,
    content_type: &str,
) -> Result<String, String> {
    let client = reqwest::Client::new();
    let url = format!("{}/api/generate", OLLAMA_BASE_URL);
    
    // Build the full prompt based on content type
    let full_prompt = match content_type {
        "commentary" => format!(
            "Write an original commentary on Proverbs chapter {}. \
            Provide thoughtful insights and reflections. Do not copy existing commentaries verbatim. \
            Make it personal and original. Here's the context: {}",
            chapter, prompt
        ),
        "summary" => format!(
            "Write a clear summary of the key points and themes in Proverbs chapter {}. \
            Make it original and in your own words. Context: {}",
            chapter, prompt
        ),
        "devotional" => format!(
            "Write a devotional meditation on Proverbs chapter {}. \
            Make it personal, reflective, and original. Context: {}",
            chapter, prompt
        ),
        _ => format!("Write about Proverbs chapter {}. Context: {}", chapter, prompt),
    };
    
    let response = client
        .post(&url)
        .json(&serde_json::json!({
            "model": model,
            "prompt": full_prompt,
            "stream": false
        }))
        .send()
        .await
        .map_err(|e| format!("Failed to generate text: {}", e))?;
    
    let ollama_response: OllamaResponse = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))?;
    
    Ok(ollama_response.response)
}
