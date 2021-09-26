@echo off
set torrentNameArg=%1
cd %~dp0
npm run report %torrentNameArg%