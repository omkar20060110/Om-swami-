import os

def replace_in_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    orig = content
    content = content.replace("'http://127.0.0.1:5000/api", "'/api")
    content = content.replace("\"http://127.0.0.1:5000/api", "\"/api")
    content = content.replace("`http://127.0.0.1:5000/api", "`/api")
    content = content.replace("'http://127.0.0.1:5000", "''")
    content = content.replace("\"http://127.0.0.1:5000", "\"")
    content = content.replace("`http://127.0.0.1:5000", "`")

    if orig != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {path}")

for root, dirs, files in os.walk('frontend/src'):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            replace_in_file(os.path.join(root, file))

print("Done bulk replace.")
