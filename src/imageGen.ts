import { createCanvas } from "canvas";
import fs from "fs";

function roundRect(ctx: any, x: number, y: number, width: number, height: number, radius: number) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();

    ctx.fill();
}

function compareStars(a: any, b: any) {
    return b.stargazerCount - a.stargazerCount;
}

function generateGraph(ctx: any, data: any, width: number, height: number, lineWidth: number) {
    const length = data.length
    const steps = width / length;

    ctx.lineWidth = lineWidth;
    ctx.beginPath();

    data.forEach((day: any, index: number) => {
        const x = index * steps;
        const y = (height - day.contributionCount * 2) - 2;

        if(day.contributionCount == 0) {
            ctx.lineTo(x, y);
            return;
        }

        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            const cp1x = x - steps / 2;
            const cp1y = Math.max(y * 0.9, 0);

            const cp2x = x - steps / 2;
            const cp2y = Math.max(y * 0.9, 0);

            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
        }
    });

    ctx.stroke(); 
}

function generateTag(ctx: any, x: number, y: number, data: string): void {
    const fontSize = 15;
    const padding = 10;
    
    ctx.font = `${fontSize}px Arial`;
    
    const textWidth = ctx.measureText(data).width;
    const tagWidth = textWidth + 2 * padding;
    const tagHeight = fontSize + 6;

    roundRect(ctx, x - padding, y - fontSize + 2, tagWidth, tagHeight, 3);

    ctx.fillStyle = "#ffffff";
    ctx.fillText(data, x, y);
    ctx.stroke();
    ctx.fillStyle = "#000000";
}


export function generateImage(data: object) {
    const topFiveProjects = ((data as any).user.repositories.nodes).sort(compareStars).slice(0, 5);
    const contributions = (data as any).user.contributionsCollection.contributionCalendar.weeks
    let contributionsProcessed: any = []

    contributions.forEach((week: any) => {
        week.contributionDays.forEach((day: any) => {
            contributionsProcessed.push({date: day.date, contributionCount: day.contributionCount})
        });
    });

    let canvas = createCanvas(512, 200);
    let ctx = canvas.getContext("2d");

    generateGraph(ctx, contributionsProcessed, 512, 200, 8)
    ctx.strokeStyle = "#ffffff"
    generateGraph(ctx, contributionsProcessed, 512, 200, 0.8)
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;

    topFiveProjects.forEach((project: any, index: number) => {
        generateTag(ctx, 20, 20 + (25 * index), `${project.name} | ${project.stargazerCount} stars`);
    });

    return canvas.toBuffer("image/png");
}