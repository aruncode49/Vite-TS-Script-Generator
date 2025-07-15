#!/usr/bin/env ts-node

import inquirer from "inquirer";
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const SRC = "src";
const TEMPLATES = "scripts/templates";
const OPTIONS = [
  { name: "Component", value: "components", ext: ".tsx" },
  { name: "Page", value: "pages", ext: "" },
] as const;

type Choice = (typeof OPTIONS)[number];

function loadTemplate(file: string, name: string) {
  const path = join(TEMPLATES, file);
  const content = readFileSync(path, "utf8");
  return content.replace(/__NAME__/g, name);
}

async function main() {
  const { targetDir }: { targetDir: Choice["value"] } = await inquirer.prompt([
    {
      type: "list",
      name: "targetDir",
      message: "What do you want to create?",
      choices: OPTIONS.map((o) => ({ name: o.name, value: o.value })),
    },
  ]);

  const { fileBase }: { fileBase: string } = await inquirer.prompt([
    {
      type: "input",
      name: "fileBase",
      message: `Enter ${targetDir === "components" ? "component" : "page"} name (PascalCase):`,
      validate: (s) =>
        /^[A-Z][A-Za-z0-9]*$/.test(s) || "Please use PascalCase",
    },
  ]);

  if (targetDir === "components") {
    const fileName = `${fileBase.toLowerCase()}.tsx`;
    const folder = join(SRC, targetDir);
    const filePath = join(folder, fileName);

    if (existsSync(filePath)) {
      console.error(`❌  ${filePath} already exists`);
      process.exit(1);
    }

    mkdirSync(folder, { recursive: true });

    const content = loadTemplate("component.ts.tpl", fileBase);
    writeFileSync(filePath, content, "utf8");

    console.log(`✅  Created component: ${filePath}`);
  }

  if (targetDir === "pages") {
    const pageFolder = join(SRC, "pages", fileBase);
    const indexFile = join(pageFolder, "index.tsx");
    const hookFile = join(pageFolder, "hook.ts");
    const stringsFile = join(pageFolder, "strings.ts");
    const componentsFolder = join(pageFolder, "Components");

    if (existsSync(pageFolder)) {
      console.error(`❌  Page ${fileBase} already exists`);
      process.exit(1);
    }

    mkdirSync(pageFolder, { recursive: true });
    mkdirSync(componentsFolder, { recursive: true });

    writeFileSync(indexFile, loadTemplate("page-index.tsx.tpl", fileBase));
    writeFileSync(hookFile, loadTemplate("page-hook.ts.tpl", fileBase));
    writeFileSync(stringsFile, loadTemplate("page-strings.ts.tpl", fileBase));

    console.log(`✅  Created page structure in ${pageFolder}`);
  }
}

main();
