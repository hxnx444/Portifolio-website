@echo off
git add .
git diff --cached --quiet
if %errorlevel% neq 0 (
    set /p commitMessage="Enter commit message: "
    git commit -m "%commitMessage%"
    git push origin main
) else (
    echo No changes to commit.
    pause
)