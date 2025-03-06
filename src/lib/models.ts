import mongoose from "mongoose";

export interface IUser {
    _id: string
    username: string
    password: string
    profName: string
    email: string
};

const userSchema = new mongoose.Schema({
    _id: String,
    username: { type: String, required: true },
    password: { type: String, required: true },
    profName: { type: String, required: true },
    email: { type: String, required: true }
});

export const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export interface ISticker {
    _id: string;
    url: string
    width: number
    height: number
};

const stickerSchema = new mongoose.Schema({
    url: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true }
});

export const Sticker = mongoose.models.Sticker || mongoose.model<ISticker>("Sticker", stickerSchema);

export interface IScrapbook {
    _id: string,
    owner: string, // user id
    title: string,
    visibility: "public" | "private",
    pages: Page[],
    likes: string[],
    width: number,
    height: number,
}

const scrapbookSchema = new mongoose.Schema({
    _id: String,
    owner: { type: String, required: true },
    title: { type: String, required: true },
    visibility: { type: String, required: true },
    likes: { type: Array<string> },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    pages: { type: Array<Page> }
});

export const Scrapbook = mongoose.models.Scrapbook || mongoose.model<IScrapbook>("Scrapbook", scrapbookSchema);

export interface Page {
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
    size: {
        x: number,
        y: number
    }
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
    rotation: number,
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
    rotation: number,
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