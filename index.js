// import("./dist/index.js").then(({ exec }) => exec(process.argv));
nw.Window.open('index.html', {}, function(win) {
    console.log(win);
  });