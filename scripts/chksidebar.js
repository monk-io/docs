const sidebar = require("../sidebars.js");
const fs = require("fs");
const path = require("path");

process.chdir(__dirname);

const docsDir = "../docs/";

const walkFiles = (prefix, dir) => {
  if (!dir) dir = "";
  let results = [];
  const list = fs.readdirSync(path.join(prefix, dir));
  list.forEach(function (file) {
    const stat = fs.statSync(path.join(prefix, dir, file));
    if (stat && stat.isDirectory()) {
      /* Recurse into a subdirectory */
      results = results.concat(walkFiles(prefix, path.join(dir, file)));
    } else {
      /* Is a file */
      results.push(path.join(dir, file));
    }
  });
  return results;
};

const walkSidebar = (sidebar) => {
  let results = [];
  for (const k of sidebar) {
    if (k.items) {
      results = results.concat(walkSidebar(k.items));
    } else {
      results.push(k);
    }
  }
  return results;
};

const allFilesRaw = walkFiles(docsDir);
const allFiles = new Set(allFilesRaw.map((f) => f.replace(/\..+$/, "")));
const allSidebar = new Set(walkSidebar(sidebar.mainSidebar));

const unlinked = [...allFiles].filter((f) => !allSidebar.has(f));
const missing = [...allSidebar].filter((f) => !allFiles.has(f));

console.log("Unlinked files: ", unlinked);
console.log("Missing files: ", missing);

const parseLink = (link) => {
  const m = link.match(/[^!]\[(.*?)\]\((.*?)\)/);
  if (!m) return null;
  const [url, anchor] = m[2].split("#");
  return {
    title: m[1],
    url: url === "" ? null : url,
    anchor: anchor ? "#" + anchor : null,
  };
};

const canonicalToURL = (filename) => {
    return path.join("/docs", filename) + ".md";
};

const checkLink = (source, link) => {
  const dir = path.dirname(source);
  link.source = source;
  if (!link.url) {
    link.self = true;
    link.target = source;
    return true;
  }
  try {
    const url = new URL(link.url);
    if (url.protocol) {
      link.external = true;
      return true;
    }
  } catch (e) {}
  let target = "";
  if (path.isAbsolute(link.url)) {
    target = path.join("..", link.url);
  } else {
    target = path.join(dir, link.url);
  }
  if (!target.endsWith(".md")) {
    target = target.replace(/\/$/, "") + ".md";
  }
  link.target = target;

  const canonicalTarget = path.relative(docsDir, target).replace(/\.md.*$/, "");
  link.valid = allFiles.has(canonicalTarget);

  if (!link.valid) {
    // try to find a matching file
    let segments = canonicalTarget.split("/");
    let found = false;
    while (segments.length > 0) {
      const needle = segments.join("/");
      const candidate = [...allFiles].find((f) => f.endsWith(needle));
      if (candidate) {
        link.suggestedTarget = canonicalToURL(candidate);
        break;
      }
      segments.shift();
    }
  }

  return true;
};

const checkLinksInFile = (filename) => {
  // read file contents
  const file = fs.readFileSync(path.join(docsDir, filename), "utf8");
  // find all links
  let links = file.match(/[^!]\[.*?\]\((.*?)\)/g);
  if (!links) {
    return [];
  }

  links = links.map(parseLink);
  for (const link of links) {
    checkLink(filename, link);
  }
  return Array.from(links);
};

let allLinks = [];
const linksByFile = {};
const linksByTarget = {};
for (const f of allFilesRaw) {
  const ls = checkLinksInFile(path.join(docsDir, f));
  allLinks = allLinks.concat(ls);
  linksByFile[f] = ls;
  for (const l of ls) {
    if (!linksByTarget[l.target]) linksByTarget[l.target] = [];
    linksByTarget[l.target].push(l);
  }
}

const brokenLinks = allLinks.filter((l) => l.valid === false);

console.log("Broken links: ", brokenLinks);

const fixLink = (link) => {
    if(!link.suggestedTarget) {
        console.log("No suggested target for: ", link.url);
        return;
    }
    const file = fs.readFileSync(link.source, "utf8");
    const newFile = file.replace(link.url, link.suggestedTarget);
    fs.writeFileSync(link.source, newFile);
    console.log("Fixed link: ", link.url, " -> ", link.suggestedTarget);
};

for(const l of brokenLinks) {
   // fixLink(l);
}
