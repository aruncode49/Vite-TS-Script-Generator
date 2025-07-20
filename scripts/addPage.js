import fs from "fs";
import path from "path";
import input from "@inquirer/input";
import { firstLetterToSmall } from "./utils.js";

export const addPage = async () => {
  const pageName = await input({
    message: "Enter the page name(Use PascalCase):",
    validate: (input) => {
      if (input === "") return "Page name is required";
      if (input.charAt(0) !== input.charAt(0).toUpperCase())
        return "Page name should be in PascalCase";
      const pageDir = path.join(
        process.cwd(),
        "src",
        "pages",
        firstLetterToSmall(input)
      );
      if (fs.existsSync(pageDir)) return "Page already exists";
      return true;
    },
  });

  const firstLetterToSmallPageName = firstLetterToSmall(pageName);

  const pagePath = await input({
    message: "Enter the page path:",
    default: `/${firstLetterToSmallPageName}`,
    validate: (input) => {
      if (input === "") return "Page path is required";
      return true;
    },
    transformer: (input) => (input.startsWith("/") ? input : `/${input}`),
  });

  const pageFilePath = path.join(
    process.cwd(),
    "src",
    "pages",
    firstLetterToSmallPageName
  );

  // Create the page folder
  fs.mkdirSync(pageFilePath, { recursive: true });

  // Create the components folder (empty only)
  const componentsFolder = path.join(pageFilePath, "components");
  fs.mkdirSync(componentsFolder, { recursive: true });

  // Create the interfaces folder
  const interfacesFolder = path.join(pageFilePath, "interfaces");
  fs.mkdirSync(interfacesFolder, { recursive: true });

  // Create index.module.css
  const cssFilePath = path.join(pageFilePath, "index.module.css");
  fs.writeFileSync(cssFilePath, `/* Styles for ${pageName} page */`);

  // Create stringConstants.ts
  const stringConstantPath = path.join(pageFilePath, "stringConstants.ts");
  fs.writeFileSync(
    stringConstantPath,
    `export const ${firstLetterToSmallPageName}StringConstant = {
    // someString: "Some string",
};`
  );

  // Create index.hooks.ts
  const hooksFilePath = path.join(pageFilePath, "index.hooks.ts");
  fs.writeFileSync(
    hooksFilePath,
    `// import { useEffect, useRef, useState } from "react";

// export function use${pageName}() {
//     // hooks, states, refs, actions, effects
//     return {
//         state: {},
//         vars: {},
//         actions: {},
//     };
// }
`
  );

  // Create index.tsx
  const indexFilePath = path.join(pageFilePath, "index.tsx");
  fs.writeFileSync(
    indexFilePath,
    `// import styles from './index.module.css';
// import { use${pageName} } from './index.hooks';
// import { ${firstLetterToSmallPageName}StringConstant } from './stringConstants';

const ${pageName} = () => {
    // const { state, actions, vars } = use${pageName}();
    return (
        <div>
            <h1>${pageName} Page</h1>
        </div>
    );
};

export default ${pageName};
`
  );

  // Create route.ts
  const routeFilePath = path.join(pageFilePath, "route.ts");
  fs.writeFileSync(
    routeFilePath,
    `import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../routes";
import { lazy } from "react";

export const ${firstLetterToSmallPageName}Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "${pagePath}",
  component: lazy(() => import(".")),
});
`
  );

  console.log(`✅ Page created successfully at: ${pageFilePath}`);
};
