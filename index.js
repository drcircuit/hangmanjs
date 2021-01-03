const express = require("express");
const server = express();
const PORT = process.env.PORT || 8080;
const fs = require("fs");
const readline = require("readline");
const WORDLIST = __dirname+"/ordliste.txt";
const words = [];
const lr = readline.createInterface({input: fs.createReadStream(WORDLIST, {encoding:"latin1"})});
lr.on("line", (line)=>{
    let lineParts = line.split("\t");
    if(lineParts[0] !== "LOEPENR"){
        words.push(lineParts[2]);
    }
});

lr.on("close", ()=>{
    server.use("/", express.static(__dirname+"/public"));
    server.get("/api/word", (req, res)=>{
        res.send(words[Math.floor(Math.random()*words.length)]);
    });
    server.listen(PORT, ()=>{
        console.log("Server listening on port ", PORT);
    });
});