import editor from "@inquirer/editor";
import input from "@inquirer/input";
import select from "@inquirer/select";
import fs from "fs";
import JsonToTs from "json-to-ts";
import path from "path";
import { firstLetterToSmall } from "./utils.js";

export async function addInterface() {
  const interfaceLevel = await select({
    message: "Select the interface level",
    choices: [
      { name: "Project Level", value: "project" },
      { name: "Page Level", value: "page" },
    ],
  });

  let interfacePath;

  if (interfaceLevel === "page") {
    let pagePaths = path.join(process.cwd(), "src", "pages");
    pagePaths = fs.readdirSync(pagePaths).map((page) => ({
      name: page,
      value: page,
    }));

    const selectedPage = await select({
      message: "Select the page",
      choices: pagePaths,
    });

    interfacePath = path.join(
      process.cwd(),
      "src",
      "pages",
      selectedPage,
      "interfaces"
    );
  } else {
    interfacePath = path.join(process.cwd(), "src", "interfaces");
  }

  const interfaceName = await input({
    message: "Enter the interface name (Use PascalCase):",
    validate: (input) => {
      if (!input) return "Interface name is required";
      if (input[0] !== input[0].toUpperCase())
        return "Interface name should be in PascalCase";
      const filePath = path.join(
        interfacePath,
        firstLetterToSmall(input) + ".ts"
      );
      if (fs.existsSync(filePath)) return "Interface already exists";
      return true;
    },
  });

  // Loop until valid JSON is entered
  let parsedJson;
  while (true) {
    const userInput = await editor({
      message: "Enter the JSON object:",
    });

    try {
      parsedJson = JSON.parse(userInput);
      break; // Exit loop if JSON is valid
    } catch (error) {
      console.error("\n❌ Invalid JSON. Please try again.\n");
    }
  }

  const ts = JsonToTs(parsedJson, {
    rootName: `I${interfaceName}`,
  });

  const tsString = ts.map((t) => t.toString()).join("\n\n");

  const targetDir = path.dirname(
    path.join(interfacePath, firstLetterToSmall(interfaceName) + ".ts")
  );

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(interfacePath, firstLetterToSmall(interfaceName) + ".ts"),
    `export ${tsString}`
  );

  console.log("✅ Interface added successfully");
}
