#!/usr/bin/env python3
"""
Simple Installer for Proverbs Book AI
Works on Windows, macOS, and Linux
Installs everything automatically and launches a simple web-based interface
"""

import os
import sys
import subprocess
import platform
import urllib.request
import json
import webbrowser
import http.server
import socketserver
import threading
from pathlib import Path

class Colors:
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    END = '\033[0m'

def print_status(msg):
    print(f"{Colors.GREEN}✓{Colors.END} {msg}")

def print_warning(msg):
    print(f"{Colors.YELLOW}⚠{Colors.END} {msg}")

def print_error(msg):
    print(f"{Colors.RED}✗{Colors.END} {msg}")

def print_info(msg):
    print(f"{Colors.BLUE}ℹ{Colors.END} {msg}")

def run_command(cmd, check=True):
    """Run a shell command"""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        if check and result.returncode != 0:
            return False, result.stderr
        return True, result.stdout
    except Exception as e:
        return False, str(e)

def check_command(cmd):
    """Check if a command exists"""
    success, _ = run_command(f"which {cmd}" if platform.system() != "Windows" else f"where {cmd}", check=False)
    return success

def install_ollama():
    """Install Ollama"""
    print_info("Installing Ollama...")
    
    system = platform.system()
    if system == "Darwin":  # macOS
        if check_command("brew"):
            success, _ = run_command("brew install ollama")
            if success:
                print_status("Ollama installed via Homebrew")
                return True
        # Fallback to curl script
        success, _ = run_command("curl -fsSL https://ollama.ai/install.sh | sh")
        if success:
            print_status("Ollama installed")
            return True
    elif system == "Linux":
        success, _ = run_command("curl -fsSL https://ollama.ai/install.sh | sh")
        if success:
            print_status("Ollama installed")
            return True
    else:  # Windows
        print_warning("Please install Ollama manually from https://ollama.ai/download/windows")
        webbrowser.open("https://ollama.ai/download/windows")
        return False
    
    return False

def install_pandoc():
    """Install Pandoc"""
    print_info("Installing Pandoc...")
    
    system = platform.system()
    if system == "Darwin":  # macOS
        if check_command("brew"):
            success, _ = run_command("brew install pandoc")
            if success:
                print_status("Pandoc installed via Homebrew")
                return True
    elif system == "Linux":
        success, _ = run_command("sudo apt-get update && sudo apt-get install -y pandoc")
        if success:
            print_status("Pandoc installed")
            return True
    else:  # Windows
        print_warning("Please install Pandoc manually from https://pandoc.org/installing.html")
        webbrowser.open("https://pandoc.org/installing.html")
        return False
    
    return False

def install_python_packages():
    """Install Python packages"""
    print_info("Installing Python packages...")
    
    python_cmd = "python3" if platform.system() != "Windows" else "python"
    script_dir = Path(__file__).parent
    requirements = script_dir / "requirements.txt"
    
    if requirements.exists():
        success, _ = run_command(f"{python_cmd} -m pip install --user -q -r {requirements}")
        if success:
            print_status("Python packages installed")
            return True
    
    return False

def start_ollama():
    """Start Ollama service"""
    print_info("Starting Ollama service...")
    
    # Check if already running
    try:
        import urllib.request
        urllib.request.urlopen("http://localhost:11434/api/tags", timeout=2)
        print_status("Ollama is already running")
        return True
    except:
        pass
    
    # Start Ollama
    system = platform.system()
    if system == "Windows":
        subprocess.Popen(["ollama", "serve"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    else:
        subprocess.Popen(["ollama", "serve"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    # Wait for it to start
    import time
    for _ in range(10):
        time.sleep(1)
        try:
            urllib.request.urlopen("http://localhost:11434/api/tags", timeout=1)
            print_status("Ollama service started")
            return True
        except:
            continue
    
    print_warning("Ollama may not have started. Please start it manually: ollama serve")
    return False

def download_model(model_name="phi3:mini"):
    """Download default AI model"""
    print_info(f"Downloading AI model: {model_name}...")
    print_info("This may take several minutes (model is ~2GB)...")
    
    import urllib.request
    import json
    
    try:
        # Check if model exists
        req = urllib.request.Request("http://localhost:11434/api/tags")
        response = urllib.request.urlopen(req, timeout=5)
        models = json.loads(response.read())
        
        model_exists = False
        if "models" in models:
            for model in models["models"]:
                if model_name in model.get("name", ""):
                    model_exists = True
                    break
        
        if model_exists:
            print_status(f"Model {model_name} already installed")
            return True
        
        # Download model
        req = urllib.request.Request(
            "http://localhost:11434/api/pull",
            data=json.dumps({"name": model_name}).encode(),
            headers={"Content-Type": "application/json"}
        )
        response = urllib.request.urlopen(req, timeout=300)
        
        # Stream the download
        for line in response:
            try:
                data = json.loads(line.decode())
                if "status" in data:
                    print(f"  {data['status']}", end='\r')
            except:
                pass
        
        print_status(f"Model {model_name} downloaded successfully")
        return True
    except Exception as e:
        print_error(f"Failed to download model: {e}")
        return False

def create_web_interface():
    """Create a simple web-based interface"""
    html_content = """<!DOCTYPE html>
<html>
<head>
    <title>Proverbs Book AI</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 2rem;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            padding: 2rem;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }
        h1 { color: #333; margin-bottom: 1rem; }
        .section { margin-bottom: 2rem; }
        button {
            padding: 0.75rem 1.5rem;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1rem;
            margin: 0.5rem;
        }
        button:hover { background: #5568d3; }
        textarea {
            width: 100%;
            min-height: 200px;
            padding: 1rem;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-family: inherit;
            font-size: 1rem;
        }
        select, input {
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
            margin: 0.5rem;
        }
        .status { padding: 1rem; background: #f0f0f0; border-radius: 6px; margin: 1rem 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📖 Proverbs Book AI</h1>
        
        <div class="section">
            <h2>Generate Chapter Content</h2>
            <div>
                <label>Chapter Number (1-31):</label>
                <input type="number" id="chapter" min="1" max="31" value="1">
            </div>
            <div>
                <label>Content Type:</label>
                <select id="contentType">
                    <option value="commentary">Commentary</option>
                    <option value="summary">Summary</option>
                    <option value="devotional">Devotional</option>
                </select>
            </div>
            <div>
                <label>AI Model:</label>
                <select id="model">
                    <option value="phi3:mini">Phi-3 Mini (Fastest)</option>
                    <option value="mistral:7b">Mistral 7B (Best Quality)</option>
                    <option value="llama3.2:3b">Llama 3.2 3B (Balanced)</option>
                </select>
            </div>
            <button onclick="generateText()">Generate Chapter</button>
            <div id="textStatus" class="status" style="display:none;"></div>
            <textarea id="generatedText" placeholder="Generated content will appear here..."></textarea>
        </div>
        
        <div class="section">
            <h2>Your Book</h2>
            <div id="chapters"></div>
            <button onclick="exportBook()">Export Book as PDF</button>
            <button onclick="exportBook('epub')">Export Book as EPUB</button>
        </div>
    </div>
    
    <script>
        let chapters = [];
        
        async function generateText() {
            const chapter = document.getElementById('chapter').value;
            const contentType = document.getElementById('contentType').value;
            const model = document.getElementById('model').value;
            const statusDiv = document.getElementById('textStatus');
            const textArea = document.getElementById('generatedText');
            
            statusDiv.style.display = 'block';
            statusDiv.textContent = 'Generating... This may take 30-60 seconds.';
            textArea.value = '';
            
            try {
                const response = await fetch('http://localhost:8000/generate', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({chapter, contentType, model})
                });
                
                const data = await response.json();
                if (data.success) {
                    textArea.value = data.text;
                    statusDiv.textContent = 'Generated successfully!';
                    statusDiv.style.background = '#d4edda';
                    
                    // Save chapter
                    chapters.push({
                        number: chapter,
                        content: data.text,
                        type: contentType
                    });
                    updateChaptersList();
                } else {
                    statusDiv.textContent = 'Error: ' + data.error;
                    statusDiv.style.background = '#f8d7da';
                }
            } catch (error) {
                statusDiv.textContent = 'Error: ' + error.message;
                statusDiv.style.background = '#f8d7da';
            }
        }
        
        function updateChaptersList() {
            const div = document.getElementById('chapters');
            div.innerHTML = '<h3>Chapters (' + chapters.length + ')</h3>';
            chapters.forEach((ch, i) => {
                div.innerHTML += `<div>Chapter ${ch.number}: ${ch.type} (${ch.content.length} chars)</div>`;
            });
        }
        
        async function exportBook() {
            if (chapters.length === 0) {
                alert('Please generate at least one chapter first!');
                return;
            }
            
            const response = await fetch('http://localhost:8000/export', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({chapters, format: 'pdf'})
            });
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'proverbs-book.pdf';
            a.click();
        }
    </script>
</body>
</html>"""
    
    script_dir = Path(__file__).parent
    html_file = script_dir / "index.html"
    html_file.write_text(html_content)
    return html_file

def start_web_server(port=8000):
    """Start a simple web server"""
    class Handler(http.server.SimpleHTTPRequestHandler):
        def do_POST(self):
            if self.path == '/generate':
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode())
                
                # Call Ollama API
                import urllib.request
                prompt = f"Write an original {data['contentType']} on Proverbs chapter {data['chapter']}. Make it personal and original."
                
                req = urllib.request.Request(
                    "http://localhost:11434/api/generate",
                    data=json.dumps({
                        "model": data['model'],
                        "prompt": prompt,
                        "stream": False
                    }).encode(),
                    headers={"Content-Type": "application/json"}
                )
                
                try:
                    response = urllib.request.urlopen(req, timeout=120)
                    result = json.loads(response.read())
                    text = result.get('response', '')
                    
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({"success": True, "text": text}).encode())
                except Exception as e:
                    self.send_response(500)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode())
            
            elif self.path == '/export':
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode())
                
                # Create markdown
                markdown = f"# Proverbs Book\n\n"
                for ch in data['chapters']:
                    markdown += f"## Chapter {ch['number']}\n\n{ch['content']}\n\n"
                
                # Convert to PDF using pandoc
                import tempfile
                with tempfile.NamedTemporaryFile(mode='w', suffix='.md', delete=False) as f:
                    f.write(markdown)
                    md_file = f.name
                
                pdf_file = md_file.replace('.md', '.pdf')
                success, _ = run_command(f"pandoc {md_file} -o {pdf_file}")
                
                if success and os.path.exists(pdf_file):
                    self.send_response(200)
                    self.send_header('Content-type', 'application/pdf')
                    self.send_header('Content-Disposition', 'attachment; filename=proverbs-book.pdf')
                    self.end_headers()
                    with open(pdf_file, 'rb') as f:
                        self.wfile.write(f.read())
                    os.unlink(md_file)
                    os.unlink(pdf_file)
                else:
                    self.send_response(500)
                    self.end_headers()
                    self.wfile.write(b"Export failed")
    
    os.chdir(Path(__file__).parent)
    with socketserver.TCPServer(("", port), Handler) as httpd:
        print_status(f"Web interface started at http://localhost:{port}")
        print_info("Opening browser...")
        webbrowser.open(f"http://localhost:{port}")
        print_info("Press Ctrl+C to stop the server")
        httpd.serve_forever()

def main():
    """Main installation and setup"""
    print("=" * 50)
    print("  Proverbs Book AI - Simple Installer")
    print("=" * 50)
    print()
    
    # Check Python version
    if sys.version_info < (3, 8):
        print_error("Python 3.8+ is required")
        sys.exit(1)
    
    print_status(f"Python {sys.version.split()[0]} detected")
    print()
    
    # Install dependencies
    print("Step 1: Installing dependencies...")
    print()
    
    if not check_command("ollama"):
        install_ollama()
    else:
        print_status("Ollama is already installed")
    
    if not check_command("pandoc"):
        install_pandoc()
    else:
        print_status("Pandoc is already installed")
    
    install_python_packages()
    print()
    
    # Start Ollama
    print("Step 2: Starting Ollama service...")
    start_ollama()
    print()
    
    # Download model
    print("Step 3: Setting up AI model...")
    download_model()
    print()
    
    # Create web interface
    print("Step 4: Creating web interface...")
    create_web_interface()
    print()
    
    # Start server
    print("=" * 50)
    print("  Setup Complete!")
    print("=" * 50)
    print()
    print("Starting web interface...")
    print()
    
    try:
        start_web_server()
    except KeyboardInterrupt:
        print("\n\nShutting down...")
        sys.exit(0)

if __name__ == "__main__":
    main()
