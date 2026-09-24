from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
HTML_FILES = [path for path in ROOT.rglob("*.html") if ".git" not in path.parts]
ERRORS = []
WARNINGS = []
LOCAL_SCHEME_PREFIXES = ("http://", "https://", "mailto:", "javascript:", "#", "data:")

for html_file in HTML_FILES:
    # chatbot.html is an HTML fragment injected into the portfolio, not a standalone page.
    if html_file.as_posix().endswith("View/Chatbot/chatbot.html"):
        continue
    text = html_file.read_text(encoding="utf-8")

    if not re.search(r"<title>.*?</title>", text, re.I | re.S):
        ERRORS.append(f"{html_file}: missing <title>")
    if not re.search(r'<meta\s+name=["\']description["\']\s+content=', text, re.I):
        WARNINGS.append(f"{html_file}: missing meta description")
    if not re.search(r'<meta\s+name=["\']viewport["\']', text, re.I):
        WARNINGS.append(f"{html_file}: missing viewport meta")

    ids = re.findall(r'\bid=["\']([^"\']+)["\']', text, re.I)
    duplicates = {item for item in ids if ids.count(item) > 1}
    for item in sorted(duplicates):
        ERRORS.append(f"{html_file}: duplicate id '{item}'")

    for attribute in ("src", "href"):
        for value in re.findall(rf'\b{attribute}=["\']([^"\']+)["\']', text, re.I):
            if value.startswith(LOCAL_SCHEME_PREFIXES):
                continue
            clean_value = value.split("#", 1)[0].split("?", 1)[0].strip()
            if not clean_value:
                continue
            target = (html_file.parent / clean_value).resolve()
            if not target.exists():
                ERRORS.append(f"{html_file}: broken {attribute} '{value}'")

    for image in re.findall(r'<img\b[^>]*>', text, re.I | re.S):
        if not re.search(r'\balt=["\'][^"\']*["\']', image, re.I):
            ERRORS.append(f"{html_file}: image missing alt text")

    if html_file.parent.name == "Blog" and html_file.name != "index.html":
        has_shared_theme = 'src="../View Controller/themeViewModel.js"' in text
        has_shared_scroll = 'src="../View Controller/scrollControlsViewModel.js"' in text
        has_legacy_scroll = 'src="scroll-controls.js"' in text
        has_inline_theme = "function applyTheme(theme)" in text and "localStorage.getItem('portfolioTheme')" in text
        if not has_shared_theme and not has_inline_theme:
            ERRORS.append(f"{html_file}: no theme controller available")
        if not has_shared_scroll and not has_legacy_scroll:
            ERRORS.append(f"{html_file}: no scroll controller available")
        if 'src="blogViewController.js"' not in text:
            ERRORS.append(f"{html_file}: missing required script 'blogViewController.js'")
        if not re.search(r'<meta\s+property=["\']og:title["\']', text, re.I):
            WARNINGS.append(f"{html_file}: missing Open Graph title")

if not (ROOT / "robots.txt").exists():
    ERRORS.append("robots.txt is missing")
if not (ROOT / "sitemap.xml").exists():
    ERRORS.append("sitemap.xml is missing")
if not (ROOT / "Models/portfolioModel.js").exists():
    ERRORS.append("Models/portfolioModel.js is missing")

if ERRORS:
    print("Portfolio audit failed:")
    print("\n".join(f"- {error}" for error in ERRORS))
    sys.exit(1)

print(f"Portfolio audit passed: {len(HTML_FILES)} HTML pages checked.")
if WARNINGS:
    print("Warnings:")
    print("\n".join(f"- {warning}" for warning in WARNINGS))
