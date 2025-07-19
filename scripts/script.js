import select from "@inquirer/select";
import { addPage } from "./addPage.js";
import { addInterface } from "./addInterface.js";
import { addComponent } from "./addComponent.js";
import { ExitPromptError } from "@inquirer/core"; // 👈 import this

try {
  const answer = await select({
    message: "Please select from below",
    choices: [
      {
        name: "Add Page",
        value: "page",
        description: "Add page into the project",
      },
      {
        name: "Add Interface",
        value: "interface",
        description: "Add interface into the project",
      },
      {
        name: "Add Component",
        value: "component",
        description: "Add component into the project",
      },
    ],
  });

  if (answer === "page") {
    await addPage();
  } else if (answer === "interface") {
    await addInterface();
  } else if (answer === "component") {
    await addComponent();
  }
} catch (err) {
  if (err instanceof ExitPromptError) {
    process.exit(0); // exit cleanly
  }
  console.error("❌ Unexpected error:", err);
  process.exit(1); // exit with failure
}
