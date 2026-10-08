import re

with open("schema.ts", "r") as f:
    content = f.read()

# Replace timestamp -> integer mode timestamp
content = re.sub(r'timestamp\("([^"]+)"\)\.defaultNow\(\)', r'integer("\1", { mode: "timestamp" }).default(sql`(strftime(\'%s\', \'now\'))`)', content)
content = re.sub(r'timestamp\("([^"]+)"\)', r'integer("\1", { mode: "timestamp" })', content)

# Clean up imports
import_line = 'import { boolean, real, integer, text, sqliteTable, uniqueIndex, index } from "drizzle-orm/sqlite-core";'
content = re.sub(r'import \{.*?\} from "drizzle-orm/sqlite-core";', import_line, content)

# Remove .onUpdateNow() which doesn't exist natively in Drizzle SQLite
content = content.replace('.onUpdateNow()', '')

with open("schema.ts", "w") as f:
    f.write(content)
