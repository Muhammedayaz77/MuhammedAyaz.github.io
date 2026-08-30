from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
HTML_FILES = [path for path in ROOT.rglob("*.html") if ".git" not in path.parts]
ERRORS = []

LOCAL_SCHEME_PREFIXES = ("http://", "https://", "mailto:", "javascript:", "#", "data:")

for html_file in HTML_FILES:
    text = html_file.read_text(encoding="utf-8")

    if not re.search(r"<title>.*?</title>", text, re.I | re.S):
        ERRORS.append(f"{html_file}: missing <title>")

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

    if "Classic if Dark Theme" in text:
        ERRORS.append(f"{html_file}: obsolete theme hint text")

    if html_file.parent.name == "Blog" and html_file.name != "index.html":
        has_shared_theme = 'src="../../View Controller/themeViewModel.js"' in text
        has_shared_scroll = 'src="../../View Controller/scrollControlsViewModel.js"' in text
        has_legacy_scroll = 'src="scroll-controls.js"' in text
        has_inline_theme = "function applyTheme(theme)" in text and "localStorage.getItem('portfolioTheme')" in text

        if not has_shared_theme and not has_inline_theme:
            ERRORS.append(f"{html_file}: no theme controller available")

        if not has_shared_scroll and not has_legacy_scroll:
            ERRORS.append(f"{html_file}: no scroll controller available")

        if 'src="blogViewController.js"' not in text:
            ERRORS.append(f"{html_file}: missing required script 'blogViewController.js'")

if ERRORS:
    print("Portfolio audit failed:")
    print("\n".join(f"- {error}" for error in ERRORS))
    sys.exit(1)

print(f"Portfolio audit passed: {len(HTML_FILES)} HTML pages checked.")
