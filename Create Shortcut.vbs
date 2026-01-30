' Create a desktop shortcut for Proverbs Book AI
' Double-click this file to create a shortcut on your desktop

Set oWS = WScript.CreateObject("WScript.Shell")
sLinkFile = oWS.SpecialFolders("Desktop") & "\Proverbs Book AI.lnk"
Set oLink = oWS.CreateShortcut(sLinkFile)

' Get the directory where this script is located
ScriptDir = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)

oLink.TargetPath = ScriptDir & "\Install and Launch.bat"
oLink.WorkingDirectory = ScriptDir
oLink.Description = "Proverbs Book AI - Install and Launch"
oLink.IconLocation = ScriptDir & "\src-tauri\icons\256x256.png"
oLink.Save

MsgBox "Shortcut created on desktop!" & vbCrLf & vbCrLf & "Double-click 'Proverbs Book AI' on your desktop to launch the app.", vbInformation, "Shortcut Created"
