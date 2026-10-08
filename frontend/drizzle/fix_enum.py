import re

with open("schema.ts", "r") as f:
    content = f.read()

# Find all pgEnum usage like: field: pgEnum("name", ["a", "b"])
# We will extract them and prepend to the file, and replace usage.
enums = set()
def replacer(match):
    field_name = match.group(1)
    enum_name = match.group(2)
    values = match.group(3)
    enums.add((enum_name, values))
    return f'{field_name}: {enum_name}Enum("{enum_name}")'

content = re.sub(r'(\w+):\s*pgEnum\("([^"]+)",\s*(\[[^\]]+\])\)', replacer, content)

enum_declarations = ""
for enum_name, values in enums:
    enum_declarations += f'export const {enum_name}Enum = pgEnum("{enum_name}", {values});\n'

# insert right after imports
parts = content.split('\n\n', 1)
content = parts[0] + '\n\n' + enum_declarations + '\n' + parts[1]

# Also pgTable .autoincrement() is not valid for integer().primaryKey() in PG? It's serial().
# Wait, serial("id").primaryKey() is the right way in pg.
content = re.sub(r'int\("id"\)\.autoincrement\(\)', 'serial("id")', content)
content = re.sub(r'int\("(\w+)"\)\.autoincrement\(\)', r'serial("\1")', content)

# ensure serial is imported
if 'serial' not in content:
    content = content.replace('integer as int,', 'integer as int, serial,')

with open("schema.ts", "w") as f:
    f.write(content)
