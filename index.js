const express = require("express");
const app = express();
const mongoose =require("mongoose");
const ejs = require("ejs");
var session = require('express-session');
var flash = require("connect-flash");


//bodyparser

app.use(session({
    secret:'secret',
    cookie: {maxAge:60000},
    resave: false,
    saveUninitialized:false
}));
app.use(flash());
app.use(express.urlencoded({extended:true}));

app.use(express.static(__dirname + '/public'));
//connect to mongodb
mongoose.connect("mongodb+srv://phuoc192:Phuocphan192@cluster0.7y4tv.mongodb.net/gamedb", { useNewUrlParser: true, useUnifiedTopology: true })
const gameSchema = {
    gameName: String,
    Console: String,
    imgAddress: String
}

const Game = mongoose.model('Game', gameSchema,'game');
// add new game function
// let newGame = new Game({
//     gameName: "Bravely Default 2",
//     Console: "Switch",
//     imgAddress:"https://www.nintendo.com/content/dam/noa/en_US/games/switch/b/bravely-default-ii-switch/Switch_BravelyDefault2_1200x675.jpg"
// })
// newGame.save();

app.set("view engine", "ejs");

app.get("/gamelist",(req,res)=>{
    Game.find({}, function(err, game){
        res.render('gamelist',{
            game: game,
        message: req.flash('message') 
        });
    })
    
});

// edit gamelist
app.get("/editGame/:id", function(req,res) {
    console.log(req.params.id);

    Game.findById(req.params.id, function(err,game){
        if(err){
            console.log(err);
        }else{
            console.log(game);
           
            res.render('editGame',{
                game: game
            })
        }
    })

})
app.post("/editGame/:id", function(req, res){
    const mybodydata={
        gameName: req.body.game_Name,
        Console: req.body.game_Console,
        imgAddress: req.body.game_imgAddess
    }
    Game.findByIdAndUpdate(req.params.id, mybodydata, function(err){
        if(err){
            res.redirect("edit/"+req.params.id);
        }else{
            req.flash('message',req.body.game_Name+' Edit successfully')
            res.redirect("/gamelist")
        }
    })
})

// add Game
app.get("/addGame", function(req,res){
    res.render("addGame");
})
app.post("/addGame", function(req,res){
    let newGame = new Game({
            gameName: req.body.gameTitle,
            Console: req.body.consoleType,
            imgAddress: req.body.imgAddress
        })
        newGame.save();
        req.flash('message',req.body.gameTitle+' has been added successfully')
        res.redirect("/gamelist");
})

// Delete game by id
app.get("/delete/:id",function(req, res){
    Game.findByIdAndDelete(req.params.id, function(err,project){
        if(err){
            res.redirect("/gamelist")
        }else{
            req.flash('message', 'game has been delete successfully')
            res.redirect("/gamelist")
        }
    })
})

app.get("/",(req,res)=>{
    res.render("index");
});
app.listen(3000, function(){
    console.log("server is running on 3000");
})