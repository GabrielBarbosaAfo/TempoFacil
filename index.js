import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const myAPI_KEY = "b9bae094d556306926d73700ba95d4db"
const API_URL = `http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=${myAPI_KEY}`

const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

let resultado
app.get("/", (req,res)=>{
    res.render("index.ejs",{lugar:resultado})
})

app.post("/search", async (req,res)=>{
    const myPlace = req.body["cityInput"]
    const placeAPI_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${myPlace}&limit=1&appid=${myAPI_KEY}`
    // console.log(placeAPI_URL)
    try{
        const response = await axios.get(placeAPI_URL)
        
        resultado = response.data
        const lattitunde = resultado[0].lat
        const longitude = resultado[0].lon 
        const geoURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lattitunde}&lon=${longitude}&appid=${myAPI_KEY}&units=metric`
        const placeWeather = await axios.get(geoURL)
        resultado = placeWeather.data
        res.redirect("/")

    }catch(error){
        console.log("An Error Occured..")
        res.render("index.ejs")
    }
})

app.listen(port,(req,res)=>{
    console.log(`Server is running on port ${port}`)
})


