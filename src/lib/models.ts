import mongoose from "mongoose";

export interface IUser {
    _id: string
    username: string
    password: string
};

const userSchema = new mongoose.Schema({
    _id: String,
    username: { type: String, required: true },
    password: { type: String, required: true }
});

export let User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export interface IScrapbook {
    _id: string,
    owner: string, // user id
    title: string,
    visibility: "public" | "private",
    pages: Page[],
    likes: string[]
}

const scrapbookSchema = new mongoose.Schema({
    _id: String,
    owner: { type: String, required: true },
    title: { type: String, required: true },
    pages: { type: Array<Page> }
});

export let Scrapbook = mongoose.models.Scrapbook || mongoose.model<IScrapbook>("Scrapbook", scrapbookSchema);

interface Page {
    number: number,
    elements: Element[]
}

export type Element = Image | Text | Rectangle | Circle

interface Image {
    type: "image",
    position: {
        x: number,
        y: number
    },
    scale: {
        x: number,
        y: number
    },
    rotation: number,
    url: string
}

interface Text {
    type: "text",
    position: {
        x: number,
        y: number
    },
    size: {
        x: number,
        y: number,
    },
    content: string,
    font_size: number,
    color: string,
    rotation: string,
    font: string
}

interface Rectangle {
    type: "rectangle",
    position: {
        x: number,
        y: number
    },
    size: {
        x: number,
        y: number,
    },
    rotation: string,
    color: string
}

interface Circle {
    type: "circle",
    position: {
        x: number,
        y: number
    },
    size: number,
    color: string
}