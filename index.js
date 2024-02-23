console.log("ayy")
import("./lib/index.js").then(
    ({ exec }) => exec(process.argv)
).catch((e) => {
  console.error("ERROR")
  console.error(e);
});
