//import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";
import canvas, { createCanvas } from "canvas";
import { fetchUserData } from "./gitStats";
import { generateImage } from "./imageGen";

fetchUserData("slenderman00", (data: object) => {
    console.log(data);
    generateImage(data);
})
