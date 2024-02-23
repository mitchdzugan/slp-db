import("./lib/app.js").then(
    ({ launch }) => launch(process.argv)
).catch((e) => {
  console.error("ERROR")
  console.error(e);
});
