const express = require("express");
const app = express();
const mongoose =require("mongoose");
const ejs = require("ejs");
//bodyparser
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
            game: game});
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
            res.redirect("/gamelist")
        }
    })
})

app.get("/",(req,res)=>{
    res.send("hello world");
});
app.listen(3000, function(){
    console.log("server is running on 3000");
})