@echo off
setlocal
title Engagement Invite - Control
cd /d "%~dp0"

set "PORT=5173"
set "URL=http://localhost:%PORT%/"
set "SERVER_TITLE=Engagement Invite Server"

rem Usage:  start.bat         -> start if stopped, offer to stop if running
rem         start.bat start   -> start
rem         start.bat stop    -> stop

if /i "%~1"=="start" goto start
if /i "%~1"=="stop" goto stop

call :find_pid
if defined PID (
  echo.
  echo  The invitation website is RUNNING at %URL%
  echo.
  choice /c SOC /n /m "  [S] Stop it   [O] Open in browser   [C] Cancel : "
  if errorlevel 3 goto end
  if errorlevel 2 ( start "" "%URL%" & goto end )
  goto stop
)
goto start


:start
call :find_pid
if defined PID (
  echo  Already running at %URL%
  start "" "%URL%"
  goto end
)

where npm >nul 2>nul || (
  echo  Node.js is not installed or not on PATH. Install it from https://nodejs.org
  pause
  goto end
)

if not exist "node_modules" (
  echo  First run: installing packages, this can take a minute...
  call npm install || ( echo  npm install failed. & pause & goto end )
)

echo  Starting the invitation website...
start "%SERVER_TITLE%" cmd /k "npm run dev -- --port %PORT% --strictPort"

rem Wait up to 30 seconds for the server to come up, then open the browser.
for /l %%i in (1,1,30) do (
  ping -n 2 127.0.0.1 >nul
  call :find_pid
  if defined PID goto opened
)
echo  The server did not start in time. Check the "%SERVER_TITLE%" window for errors.
pause
goto end

:opened
start "" "%URL%"
echo  Running at %URL%
echo  Run start.bat again to stop it.
ping -n 4 127.0.0.1 >nul
goto end


:stop
call :find_pid
if not defined PID (
  echo  The website is not running.
  ping -n 4 127.0.0.1 >nul
  goto end
)
echo  Stopping the invitation website...
taskkill /fi "WINDOWTITLE eq %SERVER_TITLE%*" /t /f >nul 2>nul
call :find_pid
if defined PID taskkill /pid %PID% /t /f >nul 2>nul
echo  Stopped.
ping -n 4 127.0.0.1 >nul
goto end


:find_pid
set "PID="
for /f "tokens=5" %%p in ('netstat -ano ^| findstr /r /c:":%PORT% .*LISTENING"') do set "PID=%%p"
exit /b


:end
endlocal
