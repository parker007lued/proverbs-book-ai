; Custom NSIS installer script for Windows
; Handles privacy policy check and custom installation

!include "MUI2.nsh"

; Check for privacy policy acceptance
Function CheckPrivacyPolicy
    ; Check if privacy was accepted
    ReadRegStr $0 HKCU "Software\ProverbsBookAI" "PrivacyAccepted"
    StrCmp $0 "1" privacy_accepted
    
    ; Show privacy policy page
    ExecShell "open" "$EXEDIR\privacy-policy.html"
    
    ; Wait for user to accept
    MessageBox MB_YESNO|MB_ICONQUESTION "You must accept the Privacy Policy to continue installation. Have you read and accepted the Privacy Policy?" IDYES privacy_accepted IDNO privacy_declined
    
    privacy_accepted:
        WriteRegStr HKCU "Software\ProverbsBookAI" "PrivacyAccepted" "1"
        Goto done
    
    privacy_declined:
        MessageBox MB_OK|MB_ICONSTOP "Installation cancelled. You must accept the Privacy Policy to use Proverbs Book AI."
        Abort
    
    done:
FunctionEnd

; Custom install page
Page custom CheckPrivacyPolicy
