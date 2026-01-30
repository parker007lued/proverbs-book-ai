// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod ollama;
mod image_gen;
mod book_assembler;
mod dependency_installer;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            ollama::check_ollama_installed,
            ollama::install_ollama,
            ollama::download_model,
            ollama::check_model_installed,
            ollama::ensure_default_model,
            ollama::generate_text,
            image_gen::generate_image,
            image_gen::check_sd_ready,
            book_assembler::assemble_book,
            book_assembler::export_to_pdf,
            book_assembler::export_to_epub,
            dependency_installer::check_all_dependencies,
            dependency_installer::install_ollama_auto,
            dependency_installer::install_pandoc_auto,
            dependency_installer::install_python_packages_auto,
        ])
        .setup(|app| {
            // Initialize on startup
            let app_handle = app.handle();
            
            // Check all dependencies in background on startup
            tauri::async_runtime::spawn(async move {
                // Check all dependencies
                match dependency_installer::check_all_dependencies().await {
                    Ok(status) => {
                        if !status.ollama {
                            println!("Ollama not installed. Auto-installation will be attempted.");
                            // Attempt auto-installation (non-blocking)
                            let _ = dependency_installer::install_ollama_auto().await;
                            
                            // Wait a bit, then ensure default model is downloaded
                            tokio::time::sleep(tokio::time::Duration::from_secs(5)).await;
                            let _ = ollama::ensure_default_model().await;
                        } else {
                            // Ollama is installed, check if we have models
                            let _ = ollama::ensure_default_model().await;
                        }
                        if !status.pandoc {
                            println!("Pandoc not installed. Auto-installation will be attempted.");
                            let _ = dependency_installer::install_pandoc_auto().await;
                        }
                        if status.python && !status.python_packages {
                            println!("Python packages not installed. Auto-installation will be attempted.");
                            let _ = dependency_installer::install_python_packages_auto().await;
                        }
                    }
                    Err(e) => {
                        println!("Error checking dependencies: {}", e);
                    }
                }
            });
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
