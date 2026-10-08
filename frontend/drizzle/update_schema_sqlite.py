import re

with open("schema.ts", "r") as f:
    content = f.read()

# Update imports
content = re.sub(
    r'from "drizzle-orm/mysql-core";',
    r'from "drizzle-orm/sqlite-core";',
    content
)
content = content.replace("mysqlTable", "sqliteTable")

# Replace enum usage since sqlite-core doesn't have native enums, we just use text()
content = re.sub(r'mysqlEnum\("[^"]*",\s*\[(.*?)\]\)', r'text({ enum: [\1] })', content)

content = content.replace("longtext", "text")
content = content.replace("float", "real")
content = content.replace("varchar", "text")

# SQLite autoincrement works differently. Actually integer('id').primaryKey({ autoIncrement: true })
content = re.sub(r'int\("(\w+)"\)\.autoincrement\(\)\.primaryKey\(\)', r'integer("\1").primaryKey({ autoIncrement: true })', content)

content = content.replace('int(', 'integer(')
content = content.replace('integer as int,', 'integer,')
content = content.replace('real as float,', 'real,')

with open("schema.ts", "w") as f:
    f.write(content)
