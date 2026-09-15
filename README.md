# Muhammed Ayaz — Developer Portfolio

A professional personal portfolio website for **Muhammed Ayaz**, showcasing software development experience, technical skills, selected projects, writing, and engineering work.

The portfolio is built as a lightweight, modular web application with a clear separation between data/model logic, views, view-controller behavior, reusable helpers, and project-specific pages.

## Live Portfolio

🌐 **Website:** https://muhammedayaz77.github.io/MuhammedAyaz.github.io/

## Repository

💻 **GitHub:** https://github.com/Muhammedayaz77/MuhammedAyaz.github.io

## Overview

This portfolio is designed to present Muhammed Ayaz's work in a clean and structured way for recruiters, hiring managers, developers, and anyone interested in his projects and technical capabilities.

The site brings together:

- Professional profile and introduction
- Technical skills and development focus
- Selected software projects
- iOS and Swift-related work
- Hind Pharma project information
- Technical blog content
- Contact and professional links
- Responsive navigation and theme support
- Maintainable, modular front-end architecture

## Architecture

The project follows a structured architecture that keeps the main responsibilities separated:

```text
MuhammedAyaz.github.io/
│
├── Models/
│   └── portfolioModel.js
│
├── View/
│   └── home.html
│
├── View Controller/
│   ├── portfolioViewModel.js
│   ├── mobileNavViewModel.js
│   ├── scrollControlsViewModel.js
│   ├── themeViewModel.js
│   ├── styles.css
│   └── theme.css
│
├── Projects/
│   ├── hind-pharma.html
│   └── swift-extension-toolkit.html
│
├── Helper/
│   ├── normalize_blog.py
│   └── portfolio_audit.py
│
├── Assets/
├── Blog/
├── tests/
│
├── index.html
├── package.json
├── playwright.config.js
├── robots.txt
└── sitemap.xml
```

The repository currently uses dedicated **Models**, **View**, **View Controller**, **Projects**, **Helper**, **Assets**, **Blog**, and **tests** areas rather than keeping all functionality in a single page or script.

## Technology Stack

### Frontend

- HTML5
- CSS3
- JavaScript
- Responsive web design

### Development & Tooling

- Node.js / npm
- Playwright for browser testing
- Python helper scripts for portfolio maintenance and auditing
- Git and GitHub

## Key Project Areas

### Portfolio Model

The `Models/portfolioModel.js` file provides the portfolio data/model layer used by the website.

### View

The `View/` layer contains the primary portfolio page and presentation-oriented markup.

### View Controller

The `View Controller/` layer contains the application's front-end behavior and presentation coordination, including portfolio rendering, mobile navigation, scroll controls, and theme management.

### Projects

Project-specific pages are kept separately inside `Projects/`. Current highlighted project pages include:

- **Hind Pharma** — pharmaceutical software project showcase
- **Swift Extension Toolkit** — Swift/iOS-oriented developer project showcase

### Helpers

The `Helper/` directory contains development utilities used to support the portfolio, including blog normalization and portfolio auditing scripts.

### Testing

The project includes a `tests/` directory and Playwright configuration for browser-level validation and regression testing.

## Design Goals

The portfolio is built around a few practical principles:

- **Clarity** — information should be easy to scan and understand.
- **Modularity** — features should remain separated into logical layers.
- **Maintainability** — content and behavior should be straightforward to update.
- **Responsive Design** — the experience should work across desktop and mobile screens.
- **Performance** — avoid unnecessary dependencies and keep the site lightweight.
- **Professional Presentation** — projects and technical work should be presented clearly for professional review.

## Featured Work

The portfolio is intended to evolve as new projects are completed. Selected work can be added as independent project pages without changing the overall site structure.

## Future Enhancements

Planned improvements can be added incrementally without redesigning the core architecture. Examples include:

- Portfolio chatbot / smart assistant
- Additional project pages
- More technical articles and blog content
- Improved automated testing
- Additional accessibility improvements
- Performance and SEO refinements

## Development

Clone the repository:

```bash
git clone https://github.com/Muhammedayaz77/MuhammedAyaz.github.io.git
cd MuhammedAyaz.github.io
```

Install dependencies:

```bash
npm install
```

Run the project's configured tooling as needed during development.

## Deployment

This repository is configured as a GitHub Pages-style personal portfolio repository. The public portfolio is available from the live website link above.

## Author

**Muhammed Ayaz**

Software Developer focused on building practical software projects, with experience across iOS development, Swift, Python, web development, and related technologies.

### Links

- GitHub: https://github.com/Muhammedayaz77
- Portfolio: https://muhammedayaz77.github.io/MuhammedAyaz.github.io/

## License

Unless otherwise stated in individual project files, the portfolio content and project materials are maintained by Muhammed Ayaz.
