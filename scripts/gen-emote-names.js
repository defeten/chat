import { readFile, writeFile } from "fs/promises";

const cssFilePath = "./src/client/emotes.css";
const jsonFilePath = "./src/client/emotes.json";

const emoteRegex = /data-emote="([^"]+)"/g;

async function extractEmoteNames(filePath) {
  try {
    const cssContent = await readFile(filePath, "utf-8");

    const matches = new Set(
      [...cssContent.matchAll(emoteRegex)].map((match) => match[1])
    );
    const jsonOutput = JSON.stringify([...matches.values()], null, 2);
    await writeFile(jsonFilePath, jsonOutput);

    console.log(`Successfully extracted ${matches.size} emote names.`);
    console.log(`JSON array saved to ${jsonFilePath}`);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error(`Error: The file '${filePath}' was not found.`);
    } else {
      console.error(`An unexpected error occurred: ${error.message}`);
    }
    process.exit(1);
  }
}

extractEmoteNames(cssFilePath);
