const { spawn } = require("child_process");

function run(command) {
  spawn(command, { stdio: "inherit", shell: true, cwd: __dirname + "/.." });
}

run("npx tailwindcss -i ./src/css/input.css -o ./public/css/tailwind.css --watch");
run("node --watch server.js");
