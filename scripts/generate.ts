#!/usr/bin/env ts-node

import inquirer from "inquirer";
import { writeFileSync, mkdirSync, existsSync, readFileSync, readdirSync, statSync } from "node:fs";
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

function getExistingPages(): string[] {
  const pagesPath = join(SRC, "pages");
  if (!existsSync(pagesPath)) return [];
  return readdirSync(pagesPath)
    .filter((dir) => {
      const fullPath = join(pagesPath, dir);
      return statSync(fullPath).isDirectory() && dir !== "components";
    });
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

  // Component handling
  if (targetDir === "components") {
    const { componentType }: { componentType: "global" | "page" } =
      await inquirer.prompt([
        {
          type: "list",
          name: "componentType",
          message: "Is it a Global or Page Component?",
          choices: [
            { name: "Global Component", value: "global" },
            { name: "Page Component", value: "page" },
          ],
        },
      ]);

    let selectedPage = "";
    if (componentType === "page") {
      const existingPages = getExistingPages();
      if (existingPages.length === 0) {
        console.error("❌  No pages found inside src/pages");
        process.exit(1);
      }

      const response = await inquirer.prompt([
        {
          type: "list",
          name: "selectedPage",
          message: "Choose the page to add the component to:",
          choices: existingPages,
        },
      ]);

      selectedPage = response.selectedPage;
    }

    const { fileBase }: { fileBase: string } = await inquirer.prompt([
      {
        type: "input",
        name: "fileBase",
        message: `Enter component name (PascalCase):`,
        validate: (s) =>
          /^[A-Z][A-Za-z0-9]*$/.test(s) || "Please use PascalCase",
      },
    ]);

    const templateFile =
      componentType === "global"
        ? "component-rc.ts.tpl"
        : "component-pc.ts.tpl";

    const folder =
      componentType === "global"
        ? join(SRC, "components")
        : join(SRC, "pages", selectedPage, "Components");

    const fileName = `${fileBase.charAt(0).toLowerCase()}${fileBase.slice(1)}.tsx`;
    const filePath = join(folder, fileName);

    if (existsSync(filePath)) {
      console.error(`❌  ${filePath} already exists`);
      process.exit(1);
    }

    mkdirSync(folder, { recursive: true });

    const content = loadTemplate(templateFile, fileBase);
    writeFileSync(filePath, content, "utf8");

    const prefix = componentType === "global" ? "RC" : "PC";
    console.log(`✅  Created ${prefix}${fileBase} at ${filePath}`);
    return;
  }

  // Page handling
  if (targetDir === "pages") {
    const { fileBase }: { fileBase: string } = await inquirer.prompt([
      {
        type: "input",
        name: "fileBase",
        message: `Enter page name (PascalCase):`,
        validate: (s) =>
          /^[A-Z][A-Za-z0-9]*$/.test(s) || "Please use PascalCase",
      },
    ]);

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
