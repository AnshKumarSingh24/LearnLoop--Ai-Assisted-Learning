import re

with open("schema.ts", "r") as f:
    content = f.read()

# Update imports
content = re.sub(
    r'from "drizzle-orm/mysql-core";',
    r'from "drizzle-orm/pg-core";',
    content
)
content = content.replace("mysqlTable", "pgTable")
content = content.replace("mysqlEnum", "pgEnum")

# Replace int -> integer in import
content = re.sub(r'\bint\b,', 'integer as int,', content)
# Replace float -> doublePrecision in import
content = re.sub(r'\bfloat\b,', 'doublePrecision as float,', content)
# Replace longtext -> text in import (but we already have text, just remove longtext and replace usages with text)
content = re.sub(r'\blongtext\b,?', '', content)
content = content.replace('longtext(', 'text(')

with open("schema.ts", "w") as f:
    f.write(content)
