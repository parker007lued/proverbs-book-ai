use serde::{Deserialize, Serialize};
use std::process::Command;

#[derive(Serialize, Deserialize)]
pub struct Chapter {
    pub number: u32,
    pub title: String,
    pub content: String,
    pub images: Vec<String>, // Image file paths
}

#[derive(Serialize, Deserialize)]
pub struct BookProject {
    pub title: String,
    pub author: String,
    pub chapters: Vec<Chapter>,
    pub cover_image: Option<String>,
}

#[tauri::command]
pub async fn assemble_book(project: BookProject) -> Result<String, String> {
    // Create markdown content from project
    let mut markdown = String::new();
    
    // Title page
    markdown.push_str(&format!("# {}\n\n", project.title));
    markdown.push_str(&format!("By {}\n\n", project.author));
    markdown.push_str("---\n\n");
    
    // Table of contents
    markdown.push_str("## Table of Contents\n\n");
    for chapter in &project.chapters {
        markdown.push_str(&format!("- [Chapter {}: {}](#chapter-{})\n", 
            chapter.number, chapter.title, chapter.number));
    }
    markdown.push_str("\n---\n\n");
    
    // Chapters
    for chapter in &project.chapters {
        markdown.push_str(&format!("## Chapter {}: {}\n\n", 
            chapter.number, chapter.title));
        
        // Add images if any
        for image_path in &chapter.images {
            markdown.push_str(&format!("![Image]({})\n\n", image_path));
        }
        
        markdown.push_str(&chapter.content);
        markdown.push_str("\n\n---\n\n");
    }
    
    Ok(markdown)
}

#[tauri::command]
pub async fn export_to_pdf(markdown_content: String, output_path: String) -> Result<String, String> {
    use std::fs;
    use std::io::Write;
    
    // Check if pandoc is available
    let pandoc_check = Command::new("pandoc")
        .arg("--version")
        .output();
    
    match pandoc_check {
        Ok(output) if output.status.success() => {
            // Create temporary markdown file
            let temp_md = format!("{}.md", output_path);
            let mut file = fs::File::create(&temp_md)
                .map_err(|e| format!("Failed to create temp file: {}", e))?;
            file.write_all(markdown_content.as_bytes())
                .map_err(|e| format!("Failed to write markdown: {}", e))?;
            
            // Use pandoc to convert markdown to PDF
            let pandoc_output = Command::new("pandoc")
                .arg(&temp_md)
                .arg("-o")
                .arg(&output_path)
                .arg("--pdf-engine=pdflatex")
                .arg("--standalone")
                .output()
                .map_err(|e| format!("Failed to run pandoc: {}", e))?;
            
            // Clean up temp file
            let _ = fs::remove_file(&temp_md);
            
            if pandoc_output.status.success() {
                Ok(format!("PDF exported to {}", output_path))
            } else {
                let stderr = String::from_utf8_lossy(&pandoc_output.stderr);
                Err(format!("Pandoc failed: {}", stderr))
            }
        },
        _ => {
            // Fallback: return error with instructions
            Err("Pandoc is not installed. Please install Pandoc to export PDFs. Visit https://pandoc.org/installing.html".to_string())
        }
    }
}

#[tauri::command]
pub async fn export_to_epub(markdown_content: String, output_path: String) -> Result<String, String> {
    use std::fs;
    use std::io::Write;
    
    // Check if pandoc is available
    let pandoc_check = Command::new("pandoc")
        .arg("--version")
        .output();
    
    match pandoc_check {
        Ok(output) if output.status.success() => {
            // Create temporary markdown file
            let temp_md = format!("{}.md", output_path);
            let mut file = fs::File::create(&temp_md)
                .map_err(|e| format!("Failed to create temp file: {}", e))?;
            file.write_all(markdown_content.as_bytes())
                .map_err(|e| format!("Failed to write markdown: {}", e))?;
            
            // Use pandoc to convert markdown to EPUB
            let pandoc_output = Command::new("pandoc")
                .arg(&temp_md)
                .arg("-o")
                .arg(&output_path)
                .arg("--standalone")
                .arg("--epub-cover-image=cover.jpg") // Optional cover image
                .output()
                .map_err(|e| format!("Failed to run pandoc: {}", e))?;
            
            // Clean up temp file
            let _ = fs::remove_file(&temp_md);
            
            if pandoc_output.status.success() {
                Ok(format!("EPUB exported to {}", output_path))
            } else {
                let stderr = String::from_utf8_lossy(&pandoc_output.stderr);
                Err(format!("Pandoc failed: {}", stderr))
            }
        },
        _ => {
            Err("Pandoc is not installed. Please install Pandoc to export EPUBs. Visit https://pandoc.org/installing.html".to_string())
        }
    }
}
