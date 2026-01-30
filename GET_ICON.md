# Get a Proper Icon File

Tauri needs a valid `icon.ico` file. Here's the easiest way to get one:

## Quick Method (5 minutes)

1. **Download an icon:**
   - Go to https://www.icon-icons.com/
   - Search for "book" or "proverbs"
   - Download any icon (PNG format)

2. **Convert to ICO:**
   - Go to https://convertio.co/png-ico/
   - Upload your PNG file
   - Click "Convert"
   - Download the ICO file

3. **Save it:**
   - Save as: `src-tauri\icons\icon.ico`
   - Make sure the file is named exactly `icon.ico`

4. **Run the app:**
   ```powershell
   cd "C:\Users\parke\OneDrive\Desktop\Moms AI Model For Proverbs"
   $env:Path += ";$env:USERPROFILE\.cargo\bin"
   npm run tauri dev
   ```

## Alternative: Use Tauri Icon Generator

If you have an image file:

```powershell
cd "C:\Users\parke\OneDrive\Desktop\Moms AI Model For Proverbs"
npx @tauri-apps/cli icon path/to/your/image.png
```

This will generate all required icon sizes automatically.

## For Now (Development)

I've disabled bundling in dev mode, so try running:

```powershell
cd "C:\Users\parke\OneDrive\Desktop\Moms AI Model For Proverbs"
$env:Path += ";$env:USERPROFILE\.cargo\bin"
npm run tauri dev
```

If it still requires an icon, follow the steps above to get a proper icon.ico file.
