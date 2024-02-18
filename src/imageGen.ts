import { Canvas } from "canvas";

function compareStars(a: any, b: any) {
    return b.stargazerCount - a.stargazerCount
}

export function generateImage(data: object) {
    const topFiveProjects = ((data as any).user.repositories.nodes).sort(compareStars).slice(0, 5)
    console.log(topFiveProjects)
}