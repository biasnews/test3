from flask import Flask, render_template
from markupsafe import Markup
import os
import glob
from datetime import datetime
import markdown

app = Flask(__name__)

# Configure markdown
md = markdown.Markdown(extensions=['extra', 'codehilite'])

def get_articles(section):
    """Get articles for a specific section, sorted by date (newest first)"""
    articles = []
    news_path = f"news/{section}"
    
    if os.path.exists(news_path):
        for file_path in glob.glob(f"{news_path}/*.md"):
            filename = os.path.basename(file_path)
            # Extract date from filename (YYYY-MM-DD-story-name.md)
            try:
                date_str = filename[:10]  # First 10 characters (YYYY-MM-DD)
                date_obj = datetime.strptime(date_str, '%Y-%m-%d')
                
                # Read markdown content
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Convert markdown to HTML
                html_content = md.convert(content)
                
                # Extract title from first h2 heading
                title = "Untitled"
                lines = content.split('\n')
                for line in lines:
                    if line.startswith('## '):
                        title = line[3:].strip()
                        break
                
                articles.append({
                    'title': title,
                    'content': html_content,
                    'date': date_obj,
                    'filename': filename,
                    'date_str': date_str
                })
            except (ValueError, IndexError):
                continue
    
    # Sort by date (newest first)
    articles.sort(key=lambda x: x['date'], reverse=True)
    return articles

def get_all_archived_articles():
    """Get all articles from archives folder"""
    articles = []
    archives_path = "news/archives"
    
    if os.path.exists(archives_path):
        for file_path in glob.glob(f"{archives_path}/*.md"):
            filename = os.path.basename(file_path)
            try:
                date_str = filename[:10]
                date_obj = datetime.strptime(date_str, '%Y-%m-%d')
                
                # Extract section from path or filename
                section = "General"  # Default
                if "politics" in file_path.lower():
                    section = "Politics"
                elif "business" in file_path.lower():
                    section = "Business"
                
                # Extract title
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                title = "Untitled"
                lines = content.split('\n')
                for line in lines:
                    if line.startswith('## '):
                        title = line[3:].strip()
                        break
                
                articles.append({
                    'title': title,
                    'date': date_obj,
                    'filename': filename,
                    'date_str': date_str,
                    'section': section,
                    'file_path': file_path
                })
            except (ValueError, IndexError):
                continue
    
    # Sort by date (newest first)
    articles.sort(key=lambda x: x['date'], reverse=True)
    return articles

@app.route('/')
@app.route('/general')
def general():
    articles = get_articles('general')
    return render_template('section.html', section='general', section_title='General', articles=articles)

@app.route('/politics')
def politics():
    articles = get_articles('politics')
    return render_template('section.html', section='politics', section_title='Politics', articles=articles)

@app.route('/business')
def business():
    articles = get_articles('business')
    return render_template('section.html', section='business', section_title='Business', articles=articles)

@app.route('/archives')
def archives():
    articles = get_all_archived_articles()
    return render_template('archives.html', section='archives', articles=articles)

@app.route('/article/<path:filename>')
def view_article(filename):
    """View individual article from archives"""
    # Look for the file in archives folder
    file_path = f"news/archives/{filename}"
    
    if os.path.exists(file_path):
        # Read and convert markdown content
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        html_content = md.convert(content)
        
        # Extract title from first h2 heading
        title = "Untitled"
        lines = content.split('\n')
        for line in lines:
            if line.startswith('## '):
                title = line[3:].strip()
                break
        
        # Extract date from filename
        date_str = filename[:10]
        try:
            date_obj = datetime.strptime(date_str, '%Y-%m-%d')
        except ValueError:
            date_obj = datetime.now()
        
        return render_template('article.html', 
                             section='archives',
                             title=title, 
                             content=html_content, 
                             date=date_obj)
    else:
        return "Article not found", 404

if __name__ == '__main__':
    app.run(debug=True)
