import express, {Express, Request, Response} from "express";
import { fetchUserData } from "./gitStats";
import { generateImage } from "./imageGen";

const app = express();
const port = 80;


app.get('/username/:name', (req: any, res: any) => {
    const username = req.params.name;
    res.header('Content-Type', 'image/png');
    fetchUserData(username, (data: object) => {
        res.send(generateImage(data));
    })
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });