import select from "@inquirer/select";
import { addPage } from "./addPage.js";
import { addInterface } from "./addInterface.js";
import { addComponent } from "./addComponent.js";

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
    addPage();
} else if (answer === "interface") {
    addInterface();
} else if (answer === "component") {
    addComponent();
}