const EventEmitter = require("events");

const celebrity = new EventEmitter();

celebrity.on("update post", (type) => {
    console.log(`I like this ${type} post`);
})

celebrity.on("update post", () => {
    console.log("I like it too");
})

celebrity.emit("update post", "image");