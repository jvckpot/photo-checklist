@echo off
REM ====================================
REM GitHub Deployment Script
REM Repository: jvckpot/photo-checklist
REM ====================================

echo.
echo ========================================
echo   DEPLOYING TO GITHUB
echo ========================================
echo.

cd "Z:\Documents\AI Coding\photo-checklist"

echo [1/3] Adding GitHub remote...
git remote add origin https://github.com/jvckpot/photo-checklist.git

echo.
echo [2/3] Pushing to GitHub...
echo.
echo When prompted:
echo   Username: rbarron90@gmail.com
echo   Password: ToRememberFor1?
echo.

git push -u origin main

echo.
echo ========================================
echo   DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Next step: Enable GitHub Pages
echo   1. Go to: https://github.com/jvckpot/photo-checklist/settings/pages
echo   2. Under "Source", select: main branch
echo   3. Click Save
echo   4. Wait 2-3 minutes
echo   5. Your app will be live at:
echo      https://jvckpot.github.io/photo-checklist
echo.
pause
