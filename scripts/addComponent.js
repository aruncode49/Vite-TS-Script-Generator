import input from "@inquirer/input";
import select from "@inquirer/select";
import fs from "fs";
import path from "path";
import { firstLetterToSmall } from "./utils.js";

export async function addComponent() {
  let componentPath = "";
  let componentNamePrefix = "";

  const componentType = await select({
    message: "Select the component type",
    choices: [
      {
        name: "Global Reusable Component",
        value: "global",
      },
      {
        name: "Page Component",
        value: "page",
      },
    ],
  });

  if (componentType === "global") {
    componentPath = path.join(process.cwd(), "src", "components");
    componentNamePrefix = "RC";
  } else {
    let pagePaths = path.join(process.cwd(), "src", "pages");
    pagePaths = fs.readdirSync(pagePaths).map((page) => ({
      name: page,
      value: page,
    }));

    const selectedPage = await select({
      message: "Select the page",
      choices: pagePaths,
    });

    componentPath = path.join(
      process.cwd(),
      "src",
      "pages",
      selectedPage,
      "components"
    );

    componentNamePrefix = "PC";
  }

  let componentName = await input({
    message: "Enter component name (Use PascalCase):",
    validate: (input) => {
      if (input === "") return "Component name is required";
      if (input.charAt(0) !== input.charAt(0).toUpperCase())
        return "Component name should be in PascalCase";
      const filePath = path.join(
        componentPath,
        firstLetterToSmall(input) + ".tsx"
      );
      if (fs.existsSync(filePath)) return "Component already exists";
      return true;
    },
  });

  const componentFilePath = path.join(
    componentPath,
    firstLetterToSmall(componentName) + ".tsx"
  );

  componentName = componentNamePrefix + componentName;

  // Create the directory if it doesn't exist
  if (!fs.existsSync(path.dirname(componentFilePath))) {
    fs.mkdirSync(path.dirname(componentFilePath), { recursive: true });
  }

  fs.writeFileSync(
    componentFilePath,
    `const ${componentName} = (() => {
  //     // vars
  //     const columns: Columns[] = [
  //         {
  //             id: "name",
  //             label: "Name",
  //             minWidth: 200,
  //         },
  //         {
  //             id: "title",
  //             label: "Title",
  //             minWidth: 200,
  //         },
  //     ];

  //     // hooks
  //     const location = useLocation();

  //     // states
  //     const [user, setUser] = useState<User | null>(null);
  //     const [loading, setLoading] = useState<boolean>(true);

  //     // atom states
  //     const [user, setUser] = useAtom(userAtom);

  //     // refs
  //     const someRef = useRef<HTMLElement | null>(null);

  //     // actions
  //     const fetchUser = async () => {
  //         // console.log("fetchUser");
  //     };

  //     // effects
  //     useEffect(() => {
  //         fetchUser();
  //     }, []);

  return <div></div>;
});

export default ${componentName};
`
  );

  console.log(`✅ Component created at: ${componentFilePath}`);
}
