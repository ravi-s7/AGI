const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const https = require("https");

/**
 * Built-in detection map: keys are the technology names (matching gitignore.io API names),
 * values are indicator file(s) used to auto-detect usage in a workspace.
 */
const builtInDetectionMap = {
  node: "package.json",
  python: ["requirements.txt", "setup.py"],
  java: ["pom.xml", "build.gradle", "build.gradle.kts"],
  ruby: "Gemfile",
  rails: "Gemfile.lock",
  php: "composer.json",
  dotnet: ".csproj",
  go: "go.mod",
  rust: "Cargo.toml",
  angular: "angular.json",
  kotlin: ["build.gradle.kts", "settings.gradle.kts"],
  swift: "Package.swift",
  elixir: "mix.exs",
  haskell: "stack.yaml",
  scala: "build.sbt",
  clojure: "project.clj",
  perl: "Makefile.PL",
  lua: "init.lua",
  
  // Tools and environments
  docker: "Dockerfile",
  vscode: ".vscode",
  jetbrains: ".idea", // for IntelliJ, WebStorm, etc.
  
  // Mobile and cross-platform frameworks
  flutter: "pubspec.yaml",
  dart: "pubspec.yaml",
  
  // Others: many electron projects already have package.json
  electron: "electron.js"
};

/**
 * Common ignore rules (static section) that we always want to include.
 */
const commonRules = `# Common rules`;

/**
 * Merges built-in detection map with custom detection rules provided in the settings.
 */
function getDetectionMap() {
  const config = vscode.workspace.getConfiguration("gitignoreGenerator");
  const customMap = config.get("customDetectionMap", []);
  const mergedMap = { ...builtInDetectionMap };

  // Each custom rule should be an object with properties: tech and indicator.
  customMap.forEach(rule => {
    if (rule.tech && rule.indicator) {
      mergedMap[rule.tech] = rule.indicator;
    }
  });
  return mergedMap;
}

/**
 * Auto-detect technologies by scanning the workspace folder for indicator files.
 */
function detectTechnologies(folderPath) {
  const detectionMap = getDetectionMap();
  const detected = new Set();
  let files = [];
  try {
    files = fs.readdirSync(folderPath);
  } catch (err) {
    console.error("Error reading folder:", err);
  }

  for (const [tech, indicator] of Object.entries(detectionMap)) {
    const indicatorsArray = Array.isArray(indicator) ? indicator : [indicator];
    if (indicatorsArray.some(ind => files.includes(ind))) {
      detected.add(tech);
    }
  }
  return Array.from(detected);
}

/**
 * Fetch the full list of available gitignore templates from gitignore.io.
 */
function fetchAvailableTemplates() {
  return new Promise((resolve, reject) => {
    const url = "https://www.toptal.com/developers/gitignore/api/list";
    https.get(url, (res) => {
      let data = "";
      res.on("data", chunk => (data += chunk));
      res.on("end", () => {
        // Remove HTML tags and clean up the response
        const cleanedHtml = data.replace(/<[^>]*>/g, '');
        const cleaned = cleanedHtml.replace(/(\r\n|\n|\r)/gm, ",");
        const list = cleaned.split(",")
          .map(item => item.trim())
          .filter(item => item && !item.includes('<!DOCTYPE'));
        resolve(list);
      });
    }).on("error", reject);
  });
}

/**
 * Fetch the .gitignore content from gitignore.io for the selected technologies.
 */
function fetchGitignoreContent(techs) {
  return new Promise((resolve, reject) => {
    const url = `https://www.toptal.com/developers/gitignore/api/${techs.join(",")}`;
    https.get(url, (res) => {
      let content = "";
      res.on("data", chunk => (content += chunk));
      res.on("end", () => resolve(content));
    }).on("error", reject);
  });
}

/**
 * Merge new content with existing file content, avoiding duplicate lines.
 */
function mergeContent(existing, added) {
  const existingLines = new Set(existing.split(/\r?\n/).map(l => l.trim()).filter(l => l));
  const newLines = added.split(/\r?\n/).map(l => l.trim()).filter(l => l);
  const linesToAppend = newLines.filter(line => !existingLines.has(line));
  if (linesToAppend.length > 0) {
    return existing + "\n\n" + "# Appended by Gitignore Generator Extension" + "\n" + linesToAppend.join("\n") + "\n";
  }
  return existing; // nothing new to add
}

/**
 * Main function: Shows a multi-select prompt (with auto-detected items pre-selected),
 * then creates or updates the .gitignore file by merging fetched content with common rules.
 */
async function generateOrUpdateGitignore() {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) {
    vscode.window.showErrorMessage("No workspace folder found!");
    return;
  }
  const folderPath = folders[0].uri.fsPath;

  // Auto-detect technologies.
  const detectedTechs = detectTechnologies(folderPath);

  // Fetch full template list from gitignore.io.
  let availableTemplates;
  try {
    availableTemplates = await fetchAvailableTemplates();
  } catch (error) {
    vscode.window.showErrorMessage("Failed to fetch available gitignore templates.");
    return;
  }

  // Prepare QuickPick items with auto-detected ones pre-selected AND at the top
  const detectedItems = detectedTechs
    .filter(tech => availableTemplates.includes(tech))
    .map(label => ({
      label,
      picked: true
    }));
    
  const otherItems = availableTemplates
    .filter(tech => !detectedTechs.includes(tech))
    .map(label => ({
      label,
      picked: false
    }));
    
  // Combine detected items at the top with the rest
  const quickPickItems = [...detectedItems, ...otherItems];

  const selected = await vscode.window.showQuickPick(quickPickItems, {
    canPickMany: true,
    ignoreFocusOut: true,
    placeHolder: "Select technologies for your .gitignore file"
  });

  if (!selected || selected.length === 0) {
    vscode.window.showWarningMessage("No technologies selected. Aborting operation.");
    return;
  }

  const selectedTechs = selected.map(item => item.label);
  vscode.window.showInformationMessage(`Selected technologies: ${selectedTechs.join(", ")}`);

  // Determine operation if .gitignore already exists.
  const gitignorePath = path.join(folderPath, ".gitignore");
  let operation = "create";
  if (fs.existsSync(gitignorePath)) {
    const op = await vscode.window.showQuickPick(
      [
        { label: "Append", description: "Append new rules to existing .gitignore" },
        { label: "Overwrite", description: "Overwrite existing .gitignore file" }
      ],
      { placeHolder: ".gitignore already exists. Choose an operation:" }
    );
    if (!op) {
      vscode.window.showInformationMessage("Operation cancelled.");
      return;
    }
    operation = op.label.toLowerCase();
  }

  // Fetch gitignore content from gitignore.io for the selected technologies.
  let fetchedContent;
  try {
    fetchedContent = await fetchGitignoreContent(selectedTechs);
  } catch (error) {
    vscode.window.showErrorMessage("Failed to fetch .gitignore content.");
    return;
  }

  // Combine common rules with fetched content.
  const combinedContent = commonRules + "\n\n" + fetchedContent;

  // Write or merge content based on the chosen operation.
  try {
    if (operation === "overwrite" || !fs.existsSync(gitignorePath)) {
      fs.writeFileSync(gitignorePath, combinedContent, "utf-8");
      vscode.window.showInformationMessage(`.gitignore created/overwritten successfully for: ${selectedTechs.join(", ")}`);
    } else if (operation === "append") {
      const existingContent = fs.readFileSync(gitignorePath, "utf-8");
      const mergedWithFetched = mergeContent(existingContent, fetchedContent);
      const finalMerged = mergeContent(mergedWithFetched, commonRules);
      fs.writeFileSync(gitignorePath, finalMerged, "utf-8");
      vscode.window.showInformationMessage(`.gitignore updated successfully (appended missing rules) for: ${selectedTechs.join(", ")}`);
    }
  } catch (error) {
    vscode.window.showErrorMessage("Error writing to .gitignore: " + error.message);
  }
}

/**
 * Activate the extension.
 */
function activate(context) {
  console.log("Gitignore Generator Extension is active.");
  let disposable = vscode.commands.registerCommand("gitignore-generator.generate", generateOrUpdateGitignore);
  context.subscriptions.push(disposable);
}

/**
 * Deactivate the extension.
 */
function deactivate() {
  console.log("Gitignore Generator Extension is now deactivated.");
}

module.exports = {
  activate,
  deactivate
};
