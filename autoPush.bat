@echo off
git add .
git diff --cached --quiet
if %errorlevel% neq 0 (
    git commit -m "portfolio update"
    git push origin main
)