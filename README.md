# Quill Delta Renderer

A modern web application for viewing, editing, and testing [Quill.js Delta](https://quilljs.com/docs/delta/) JSON objects with real-time rendering and comprehensive validation.

![Project Status](https://img.shields.io/badge/Status-80%25%20Complete-green)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## 🚀 Features

- **📝 Monaco Editor Integration**: Syntax highlighting and validation for Delta JSON
- **🎨 Real-time Rendering**: Live preview of Delta content as formatted rich text
- **📱 Responsive Design**: Split-pane layout for desktop, stacked for mobile
- **🔄 Bi-directional Sync**: Edit mode with seamless JSON ↔ content synchronization
- **📁 Import/Export**: Drag & drop file support with comprehensive error handling
- **📚 Sample Examples**: Pre-built Delta examples for quick testing
- **🛠️ Advanced Validation**: Detailed error messages with fix suggestions
- **📖 In-app Help**: Comprehensive documentation and keyboard shortcuts
- **✨ Modern UI**: Built with shadcn/ui for consistent, accessible design

## 🎯 Getting Started

### Prerequisites

- **Node.js** 18.17 or later
- **npm**, **yarn**, **pnpm**, or **bun** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/zarifaziz/quilljs-renderer.git
   cd quilljs-renderer
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Quick Start Guide

1. **Try Sample Examples**: Click the "Examples" dropdown in the left panel to load pre-built Delta JSON
2. **Paste Your Delta**: Copy your Delta JSON into the Monaco editor on the left
3. **View Rendering**: See the formatted output in the right panel
4. **Toggle Edit Mode**: Use the switch in the top-right to enable editing
5. **Import/Export**: Drag & drop JSON files or use the import/export buttons
6. **Get Help**: Click the help icon (?) for comprehensive documentation

## 🏗️ Architecture

### Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Runtime**: [React 19](https://react.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Code Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Project Structure

```
quilljs-renderer/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Main application page
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── delta/                    # Delta-specific components
│   │   ├── DeltaInput.tsx        # Monaco editor with validation
│   │   └── QuillRenderer.tsx     # Delta content renderer
│   ├── layout/                   # Layout components
│   │   ├── Layout.tsx            # Main layout wrapper
│   │   └── SplitPane.tsx         # Responsive split-pane
│   ├── ui/                       # shadcn/ui components
│   ├── EditModeToggle.tsx        # Edit/read-only mode switcher
│   ├── ImportExport.tsx          # File import/export with drag & drop
│   └── HelpModal.tsx             # Comprehensive help documentation
├── hooks/                        # Custom React hooks
│   └── useMediaQuery.ts          # Responsive breakpoint detection
├── lib/                          # Utility functions
│   ├── deltaValidation.ts        # Delta JSON validation logic
│   ├── exampleDeltas.ts          # Sample Delta objects
│   └── utils.ts                  # General utilities
├── types/                        # TypeScript type definitions
│   └── quill.ts                  # Quill Delta interfaces
└── public/                       # Static assets
```

### Key Components

#### Core Architecture

- **`app/page.tsx`**: Main application orchestrator managing state and component integration
- **`components/layout/Layout.tsx`**: Responsive layout wrapper with split-pane functionality
- **`components/delta/DeltaInput.tsx`**: Monaco editor integration with real-time validation
- **`components/delta/QuillRenderer.tsx`**: Custom Delta-to-HTML renderer with edit capabilities

#### State Management

The application uses React's built-in state management with:
- **Delta Input State**: Raw JSON string from the editor
- **Parsed Delta State**: Validated Delta object for rendering
- **Edit Mode State**: Toggle between read-only and editable modes
- **Validation State**: Error handling and user feedback

#### Data Flow

```
Monaco Editor → JSON Validation → Delta Processing → HTML Rendering
     ↑                                                       ↓
User Input ←-------------- Edit Mode ←-------------- User Interaction
```

### Design Principles

- **Responsive First**: Mobile-optimized with progressive enhancement
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Performance**: Debounced updates and optimized rendering for large Delta objects
- **User Experience**: Clear error messages, helpful tooltips, and intuitive controls

## 🤝 Contributing

We welcome contributions! Please follow these guidelines to help maintain code quality and consistency.

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/zarifaziz/quilljs-renderer.git
   cd quilljs-renderer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

### Code Standards

#### TypeScript & React

- Use **TypeScript** for all new components and utilities
- Follow **React 19** best practices with hooks and function components
- Use **strict type checking** - no `any` types without justification
- Implement proper **error boundaries** and loading states

#### Styling & UI

- Use **Tailwind CSS** utility classes for styling
- Follow **shadcn/ui** patterns for new UI components
- Ensure **responsive design** works across all viewport sizes
- Maintain **dark/light mode** compatibility

#### Code Quality

- **ESLint**: Code must pass linting (`npm run lint`)
- **TypeScript**: No compilation errors (`npm run build`)
- **Formatting**: Use Prettier for consistent code formatting
- **Testing**: Add tests for new features (when test suite is implemented)

### Development Workflow

1. **Check existing issues** or create a new one to discuss your changes
2. **Create a feature branch** from `main`
3. **Implement your changes** following the code standards
4. **Test thoroughly** across different browsers and devices
5. **Update documentation** if you're adding new features
6. **Submit a pull request** with a clear description

### Pull Request Guidelines

#### Before Submitting

- [ ] Code passes all linting checks (`npm run lint`)
- [ ] Application builds successfully (`npm run build`)
- [ ] Changes tested on desktop and mobile
- [ ] No console errors or warnings
- [ ] Documentation updated (if applicable)

#### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] Tested on Chrome/Firefox/Safari
- [ ] Tested on mobile devices
- [ ] Verified accessibility features

## Screenshots (if applicable)
[Add screenshots for UI changes]
```

### Adding New Features

#### UI Components

When adding new UI components:
1. Use **shadcn/ui** as the base (`npx shadcn@latest add <component>`)
2. Create TypeScript interfaces for all props
3. Add proper **accessibility** attributes
4. Include **responsive design** considerations
5. Add **tooltips** for complex interactions

#### Delta Processing

For Delta-related features:
1. Follow the [Quill Delta specification](https://quilljs.com/docs/delta/)
2. Add comprehensive **validation**
3. Include **error handling** with user-friendly messages
4. Add **test cases** with various Delta formats
5. Update **help documentation** if needed

### Project Management

This project uses **TaskMaster** for task management:
- Tasks are defined in `.taskmaster/tasks/tasks.json`
- Check current progress with `npm run tasks` (if available)
- See the help system for feature roadmap

### Getting Help

- **Documentation**: Click the help icon (?) in the application
- **Issues**: Create a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Quill.js](https://quilljs.com/) for the Delta specification
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Next.js](https://nextjs.org/) team for the amazing framework
- [Vercel](https://vercel.com/) for seamless deployment platform

---

**Built with ❤️ using Next.js, React, and TypeScript**
