use serde::{Deserialize, Serialize};
use std::process::Command;

#[derive(Serialize, Deserialize)]
pub struct ImageGenRequest {
    pub prompt: String,
    pub style: String,
    pub chapter: u32,
}

#[tauri::command]
pub async fn check_sd_ready() -> Result<bool, String> {
    // Check if Python and required packages are available
    let python_check = Command::new("python")
        .arg("--version")
        .output()
        .or_else(|_| Command::new("python3").arg("--version").output());
    
    match python_check {
        Ok(output) => Ok(output.status.success()),
        Err(_) => Ok(false),
    }
}

#[tauri::command]
pub async fn generate_image(
    prompt: String,
    style: String,
    chapter: u32,
) -> Result<String, String> {
    // Try to find Python executable
    let python_cmd = if cfg!(target_os = "windows") {
        "python"
    } else {
        "python3"
    };
    
    // Get script path (assuming it's in the app directory)
    let script_path = format!("scripts/sd_generator.py");
    
    // Create output path
    let output_path = format!("projects/images/chapter_{}_{}.png", chapter, 
        prompt.chars().take(10).collect::<String>().replace(" ", "_"));
    
    // Call Python script
    let output = Command::new(python_cmd)
        .arg(&script_path)
        .arg("--prompt")
        .arg(&prompt)
        .arg("--style")
        .arg(&style)
        .arg("--chapter")
        .arg(&chapter.to_string())
        .arg("--output")
        .arg(&output_path)
        .output()
        .map_err(|e| format!("Failed to run image generator: {}", e))?;
    
    if output.status.success() {
        // Parse JSON response
        let stdout = String::from_utf8_lossy(&output.stdout);
        if let Ok(json) = serde_json::from_str::<serde_json::Value>(&stdout) {
            if let Some(result) = json.get("result").and_then(|v| v.as_str()) {
                return Ok(result.to_string());
            }
        }
        Ok(output_path)
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        Err(format!("Image generation failed: {}", stderr))
    }
}
