import re

with open("schema.ts", "r") as f:
    content = f.read()

content = content.replace('boolean(', 'integer({ mode: "boolean" })(')
# Wait, actually Drizzle's integer syntax is: integer('fieldName', { mode: 'boolean' })
# So we need to match boolean('name') and replace with integer('name', { mode: 'boolean' })
content = re.sub(r'boolean\("([^"]+)"\)', r'integer("\1", { mode: "boolean" })', content)

# Remove boolean from import
content = content.replace('boolean, ', '')

with open("schema.ts", "w") as f:
    f.write(content)
