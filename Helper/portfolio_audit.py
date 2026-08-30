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
        values = re.findall(rf'\b{attribute}=["\']([^"\']+)["\']', text, re.I)
        local_values = []

        for value in values:
            if value.startswith(LOCAL_SCHEME_PREFIXES):
                continue

            clean_value = value.split("#", 1)[0].split("?", 1)[0].strip()
            if not clean_value:
                continue

            local_values.append(clean_value)
            target = (html_file.parent / clean_value).resolve()
            if not target.exists():
                ERRORS.append(f"{html_file}: broken {attribute} '{value}'")

        duplicates = {item for item in local_values if local_values.count(item) > 1}
        for item in sorted(duplicates):
            ERRORS.append(f"{html_file}: duplicate local {attribute} '{item}'")

    if "Classic if Dark Theme" in text:
        ERRORS.append(f"{html_file}: obsolete theme hint text")

    if "scroll-controls.js" in text:
        ERRORS.append(f"{html_file}: legacy scroll controller reference")

    if html_file.parent.name == "Blog" and html_file.name != "index.html":
        required_scripts = (
            "../../View Controller/themeViewModel.js",
            "../../View Controller/scrollControlsViewModel.js",
            "blogViewController.js",
        )
        for script in required_scripts:
            if f'src="{script}"' not in text:
                ERRORS.append(f"{html_file}: missing required script '{script}'")

if ERRORS:
    print("Portfolio audit failed:")
    print("\n".join(f"- {error}" for error in ERRORS))
    sys.exit(1)

print(f"Portfolio audit passed: {len(HTML_FILES)} HTML pages checked.")
