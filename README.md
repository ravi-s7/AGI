# AGI - Auto Gitignore Generator

Automatically generate and update .gitignore files in VS Code. AGI auto-detects your project's technologies and lets you manually select others to create the perfect .gitignore for your needs.

<!-- Consider adding a catchy banner image or a short GIF here showing AGI in action -->

## ☑️ Features

- **Automatic .gitignore Generation**: Scans your project's file structure and dependencies to intelligently suggest appropriate .gitignore rules.
- **Technology Detection**: Identifies frameworks, languages, and tools (e.g., Node.js, Python, Java, Ruby, PHP, .NET (dotnet), Go, Rust,Angular, React, Vue.js,Docker, VSCode workspace files, JetBrains IDEs,Flutter, Dart, Kotlin, Swift, VS Code specific files, operating system files) to include relevant ignore patterns.
-  **Flexible Modes**:
    - **Create**: Generates a new .gitignore file if one doesn't exist.
    - **Append**: Adds new, relevant rules to an existing .gitignore file without removing your custom entries.
    - **Overwrite**: Creates a fresh .gitignore file based on the scan, replacing any existing one (use with caution!).
- **Comprehensive Templates**: Leverages the latest, expertly curated templates for over 570+ technologies
- **Customizable Detection**: Easily add your own detection rules for niche or project-specific technologies via VS Code settings
- **Interactive Selection**: Pre-selects auto-detected technologies but allows you to easily add or remove items from the list before generation
- **Quick & Seamless**: Integrates directly into your VS Code workflow via the Command Palette

## ☑️ Installation

1. Open VS Code
2. Navigate to Extensions (Use shortcut ⌘+Shift+X on macOS or Ctrl+Shift+X on Windows/Linux)
3. Search for "AGI - Auto Gitignore Generator"
4. Click the Install button

## ☑️ Usage

1. Ensure you have a workspace (project folder) open in VS Code
2. Open the Command Palette (Use shortcut ⌘+Shift+P on macOS or Ctrl+Shift+P on Windows/Linux)
3. Type `AGI` and select `AGI: Generate/Update .gitignore` command from the list
4. A QuickPick dialog will appear. Auto-detected technologies will be pre-selected. You can add or remove technologies from this list
5. If a .gitignore file already exists in your project root, you'll be prompted to either Append to it or Overwrite it
6. Review your new or updated .gitignore file!

## ☑️ Configuration: Custom Detection Rules

Tailor AGI to your specific needs by adding custom detection rules directly in your VS Code settings.json:

```json
"agi.customDetectionMap": [
  {
    "tech": "myCustomFramework", // The name gitignore.io recognizes for this tech
    "indicator": "my-framework-config.xml" // If this file exists, "myCustomFramework" is pre-selected
  },
  {
    "tech": "projectSpecificTool",
    "indicator": ["specific-tool.config", ".internallogging/"] // Can be a file or folder, or an array of them
  }
]
```

- **tech**: The identifier for the technology as recognized by gitignore.io
- **indicator**: The filename, folder name, or an array of filenames/folders that, if present in the workspace root, will cause the corresponding tech to be pre-selected

## ☑️ Why Choose AGI?

- **Massive Coverage**: Access to over 570 technology templates via gitignore.io
- **Save Time**: No more manual searching and copy-pasting for common .gitignore patterns
- **Keep Repos Clean**: Prevent committing unnecessary files
- **Stay Up-to-Date**: Benefit from the continuously updated templates provided by the gitignore.io community
- **Flexible & Controllable**: Auto-detection is great, but you always have the final say

## ☑️ Contributing

Your contributions are welcome and appreciated! If you have an idea for a new feature, a bug fix, or an improvement:

1. Fork the repository on GitHub: [AGI GitHub Repository](https://github.com/ravi-s7/AGI)
2. Create your feature branch: `git checkout -b feature/your-amazing-feature`
3. Commit your changes: `git commit -m 'feat: Add some amazing feature'`
4. Push to the branch: `git push origin feature/your-amazing-feature`
5. Open a Pull Request against the main branch

## ☑️ Support

If you encounter any problems or have questions, please feel free to open an issue for discussions or bug reports: [AGI GitHub Issues Page](https://github.com/ravi-s7/AGI/issues):

- Check the GitHub Issues Page to see if it has already been reported
- File a new issue if you don't find a solution

## ☑️ License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/ravi-s7/AGI/blob/main/LICENSE) file for more details.

---

Thank you for using AGI - Auto Gitignore Generator! We hope it streamlines your development workflow.

If you find AGI helpful, a review on the VS Code Marketplace would be greatly appreciated! ⭐⭐⭐⭐⭐