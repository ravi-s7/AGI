# AGI - Auto Gitignore Generator for VS Code 💻

A VS Code extension that automatically generates and updates `.gitignore` files based on auto-detected and manually selected technologies.

## ✨ Features

- **🔍 Auto-detection**: Automatically detects technologies used in your workspace
- **💡 Smart updates**: Append or overwrite existing `.gitignore` files
- **📚 Comprehensive templates**: Uses gitignore.io API to fetch the latest templates
- **🎨 Customizable**: Add your own detection rules for technologies
- **🛡️ Supports 570+ technologies** - including OSes, IDEs, programming languages, frameworks, and more to generate tailored`.gitignore` files



## 📥 Installation

1. Open VS Code
2. Go to Extensions (⌘+Shift+X / Ctrl+Shift+X)
3. Search for "AGI - Auto Gitignore Generator"
4. Click Install 

## 💻 Usage

1. Open a workspace in VS Code
2. Open the Command Palette (⌘+Shift+P / Ctrl+Shift+P)
3. Type "AGI - Generate/Update .gitignore" and select the command
4. Select technologies from the list (auto-detected technologies will be pre-selected)
5. Choose to append or overwrite if a `.gitignore` file already exists

## 🎯 Auto-detected Technologies

The extension can automatically detect many common technologies including:

-  Node.js, Python, Java, Ruby, PHP, .NET, Go, Rust
-  Angular, React, Vue (via `package.json` dependencies)
-  Docker, VS Code, JetBrains IDEs
-  Flutter, Dart, Kotlin, Swift, and more

## 🔒 Configuration

You can add custom detection rules in your VS Code settings:

```json
"agi.customDetectionMap": [
  {
    "tech": "mytech",
    "indicator": "myfile.txt"
  },
  {
    "tech": "othertechnology",
    "indicator": ["file1.txt", "file2.txt"]
  }
]
```

## ⚙️ How It Works

1. The extension scans your workspace for indicator files 
2. Technologies are detected based on file presence (e.g., `package.json` = Node.js)
3. Detected technologies are presented in a QuickPick dialog 
4. Selected technologies are used to fetch appropriate gitignore rules 
5. The extension either creates, overwrites, or updates your `.gitignore` file 

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 

## 📃 License

This project is licensed under the MIT License - see the LICENSE file for details.


