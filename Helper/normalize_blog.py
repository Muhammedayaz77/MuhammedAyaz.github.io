from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BLOG = ROOT / "View" / "Blog"

for path in sorted(BLOG.glob("*.html")):
    if path.name == "index.html":
        continue

    text = path.read_text(encoding="utf-8")
    text = text.replace("100 iOS Interview Questions &amp; Answers", "iOS Interview Questions &amp; Answers")
    text = text.replace("100 iOS Interview Questions & Answers", "iOS Interview Questions & Answers")
    text = text.replace("100 Questions", "Interview Questions")

    if 'href="blog.css"' not in text:
        text = text.replace("</head>", '    <link rel="stylesheet" href="blog.css">\n</head>', 1)

    if 'src="blogViewController.js"' not in text:
        text = text.replace("</body>", '    <script src="blogViewController.js"></script>\n</body>', 1)

    path.write_text(text, encoding="utf-8")
