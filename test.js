import { readFile } from "node:fs/promises";
import path from "node:path";

// understand forceImportJsonInModule
// place this file is on D drive, open terminal on D drive too.
async function main(absPath) {
  console.log("absPath", absPath);

  const processedPath1 = absPath.replace(/^file:\/\//, "");
  console.log("processedPath1", processedPath1); // -> /c:/markuplint-test/package.json
  const processedPath2 = processedPath1.replace("/", path.sep);
  console.log("processedPath2", processedPath2); // -> \c:/markuplint-test/package.json

  // console.log(
  //   "processedPath1",
  //   JSON.parse(await readFile(processedPath1, { encoding: "utf8" })) // [Error: ENOENT: no such file or directory, open 'D:\c:\markuplint-test\package.json']
  // );
  // console.log(
  //   "processedPath2",
  //   JSON.parse(await readFile(processedPath2, { encoding: "utf8" })) // [Error: ENOENT: no such file or directory, open 'D:\c:\markuplint-test\package.json']
  // );

  // Windows

  // current method
  const processedPathCurrent = processedPath2.replace(/^[/\\][a-z]:/i, "");
  console.log("processedPathCurrent", processedPathCurrent); // -> /markuplint-test/package.json
  console.log(
    "processedPathCurrent",
    JSON.parse(await readFile(processedPathCurrent, { encoding: "utf8" })) // open '\markuplint-test\package.json' on D drive but we need to open 'c:/markuplint-test/package.json'
  );

  // wanted
  const processedPathWanted = "c:/markuplint-test/package.json"; // we want to open this file
  console.log("processedPathWanted", processedPathWanted); // -> /markuplint-test/package.json
  console.log(
    "processedPathWanted",
    JSON.parse(await readFile(processedPathWanted, { encoding: "utf8" })) // open '\markuplint-test\package.json' on C drive
  );

  // fixed
  const processedPathFixed = processedPath2.replace(/^[/\\](?=[a-z]:)/i, ""); // if it has drive letter, it's on Windows so remove just a leading slash.
  console.log("processedPathFixed", processedPathFixed);
  console.log(
    "processedPathFixed",
    JSON.parse(await readFile(processedPathFixed, { encoding: "utf8" })) // open '\markuplint-test\package.json' on C drive correctly! at least in my case?
  );
}

main("file:///c:/markuplint-test/package.json"); // try to access a file on C drive from D drive
