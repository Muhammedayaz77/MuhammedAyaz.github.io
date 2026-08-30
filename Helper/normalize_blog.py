from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
BLOG = ROOT / "View" / "Blog"

THEME_SCRIPT = '<script src="../../View Controller/themeViewModel.js"></script>'
SCROLL_SCRIPT = '<script src="../../View Controller/scrollControlsViewModel.js"></script>'
BLOG_SCRIPT = '<script src="blogViewController.js"></script>'
BLOG_STYLE = '<link rel="stylesheet" href="blog.css">'

for path in sorted(BLOG.glob("*.html")):
    if path.name == "index.html":
        continue

    text = path.read_text(encoding="utf-8")

    text = text.replace("100 iOS Interview Questions &amp; Answers", "iOS Interview Questions &amp; Answers")
    text = text.replace("100 iOS Interview Questions & Answers", "iOS Interview Questions & Answers")
    text = text.replace("100 Questions", "Interview Questions")
    text = text.replace("100 practical iOS interview questions and answers", "Practical iOS interview questions and answers")
    text = text.replace("Classic if Dark Theme", "Switch to Light Theme")

    text = re.sub(r'\s*<script[^>]+src=["\']scroll-controls\.js["\'][^>]*></script>', "", text, flags=re.I)
    text = re.sub(r'\s*<script[^>]+src=["\'](?:\.\./)+View Controller/themeViewModel\.js["\'][^>]*></script>', "", text, flags=re.I)
    text = re.sub(r'\s*<script[^>]+src=["\'](?:\.\./)+View Controller/scrollControlsViewModel\.js["\'][^>]*></script>', "", text, flags=re.I)
    text = re.sub(r'\s*<script[^>]+src=["\']blogViewController\.js["\'][^>]*></script>', "", text, flags=re.I)

    if 'href="blog.css"' not in text:
        text = text.replace("</head>", f"    {BLOG_STYLE}\n</head>", 1)

    scripts = f"    {THEME_SCRIPT}\n    {SCROLL_SCRIPT}\n    {BLOG_SCRIPT}\n"
    text = text.replace("</body>", scripts + "</body>", 1)
    path.write_text(text, encoding="utf-8")
