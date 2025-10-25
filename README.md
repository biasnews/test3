# Bias. - News without systematic errors

A minimal, neutral news website built with Flask that presents fact-based analysis without political bias.

## Features

- **Clean, minimal design** with white background and serif fonts
- **No borders or boxes** - fully minimal aesthetic
- **Responsive layout** centered at ~70% width
- **Popup welcome message** that appears on first visit
- **Four main sections**: General, Politics, Business, and Archives
- **Markdown-based content** - easy to update without database
- **Automatic article sorting** by date (newest first)

## Quick Start

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the application:**
   ```bash
   python app.py
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5000`

## Project Structure

```
bias/
├── app.py                 # Flask application
├── requirements.txt       # Python dependencies
├── static/
│   ├── css/
│   │   └── style.css     # Minimal styling
│   ├── js/
│   │   └── popup.js      # Popup functionality
│   └── images/           # Optional images
├── templates/
│   ├── base.html         # Base template
│   ├── section.html      # Section page template
│   └── archives.html     # Archives page template
└── news/
    ├── general/          # General news articles
    ├── politics/         # Political articles
    ├── business/         # Business articles
    └── archives/         # Archived articles
```

## Adding New Articles

1. **Create a new markdown file** in the appropriate section folder
2. **Use the naming convention:** `YYYY-MM-DD-story-name.md`
3. **Start with an H2 heading** for the article title: `## Your Article Title`
4. **Include a "Bias Note"** at the end: `**Bias Note:** This article is written with factual neutrality.`

Example article structure:
```markdown
## The New Global Trade Shift
The world is witnessing a significant realignment in global trade alliances...

**Bias Note:** This article is written with factual neutrality.
```

## Archiving Articles

To archive old articles:
1. Move markdown files from section folders to `news/archives/`
2. The archives page will automatically display them

## Design Philosophy

- **Neutral presentation** - no political commentary or bias
- **Fact-based reporting** - data and information without interpretation
- **Minimal design** - clean, timeless aesthetic
- **Daily newspaper feel** - simple, addictive due to clarity and purity

## Technology Stack

- **Backend:** Python Flask
- **Templating:** Jinja2
- **Content:** Markdown files
- **Frontend:** HTML + CSS + Vanilla JavaScript
- **No database** - content managed through file system

## Navigation

- **General** (`/` or `/general`) - Default section with general news
- **Politics** (`/politics`) - Political news and analysis
- **Business** (`/business`) - Business and economic news
- **Archives** (`/archives`) - All previous articles organized by date

The application automatically loads the newest articles first and handles all routing dynamically.
