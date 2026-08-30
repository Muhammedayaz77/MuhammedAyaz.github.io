from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
HTML_FILES = [path for path in ROOT.rglob("*.html") if ".git" not in path.parts]
ERRORS = []

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
            if value.startswith(("http://", "https://", "mailto:", "javascript:", "#", "data:")):
                continue
            clean_value = value.split("#", 1)[0].split("?", 1)[0]
            if not clean_value:
                continue
            target = (html_file.parent / clean_value).resolve()
            if not target.exists():
                ERRORS.append(f"{html_file}: broken {attribute} '{value}'")

if ERRORS:
    print("Portfolio audit failed:")
    print("\n".join(f"- {error}" for error in ERRORS))
    sys.exit(1)

print(f"Portfolio audit passed: {len(HTML_FILES)} HTML pages checked.")
