const express = require("express");
const { glob } = require("glob");
const app = express();

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  const trailingSlash = req.query.s === "1" || false;
  const absolute = req.query.a === "1" || false;
  const follow = req.query.f === "1" || false;
  const nodir = req.query.n === "1" || false;
  const dot = req.query.d === "1" || false;

  const rootPath = "./static" + (trailingSlash ? "/" : "");

  glob("**/**", {
    cwd: rootPath,
    absolute,
    follow,
    nodir,
    dot,
  })
    .then((files) => {
      const jsonData = JSON.stringify(
        {
          rootPath,
          files: files,
          options: { trailingSlash, absolute, follow, nodir, dot },
        },
        null,
        2
      );
      res.send(`
        <html>
          <body>
            <h2>Legend</h2>
            <ul>
              <li><strong>s</strong> - trailing slash</li>
              <li><strong>a</strong> - absolute path</li>
              <li><strong>f</strong> - follow symlinks</li>
              <li><strong>n</strong> - no directories</li>
              <li><strong>d</strong> - dotfiles</li>
            </ul>
            <h2>Output</h2>
            <pre>${jsonData}</pre>
          </body>
        </html>
      `);
    })
    .catch((error) => {
      console.error("Error fetching files:", error);
      res.status(500).send("An error occurred");
    });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
