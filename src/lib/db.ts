import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

import { User, IUser } from './models';

const DB_URI = process.env.DB_URI;
const NO_URI_ERR = 'Please define the MONGODB_URI environment variable inside .env.local';

if (!DB_URI) console.error(NO_URI_ERR);

type DBResult<T> = {
    ok: true,
    code: number
    data: T,
    error?: never
} | {
    ok: false,
    code: number
    error: string,
    data?: never
};

async function connect() {
    if (!DB_URI) {
        console.error(NO_URI_ERR);
        return;
    }

    try {
        await mongoose.connect(DB_URI);
    } catch (error) {
        console.error('Error connecting to MongoDB: ', error);
    }
};

type LoginResult = DBResult<{
    name: string,
    id: string
}>;

export async function login(username: string, password: string): Promise<LoginResult> {
    await connect();

    const unauthorized = {
        ok: false,
        code: 401,
        error: "Username or password is incorrect."
    } as const; // so that we can't mutate

    // make sure user exists
    const user: IUser | null = await User.findOne({ username });
    if (!user) return unauthorized

    // make sure password matches
    const match = bcrypt.compare(password, user.password);
    if (!match) return unauthorized

    // matches, return user info
    return {
        ok: true,
        code: 200,
        data: {
            name: user.username,
            id: user._id
        }
    };
}

export async function register(username: string, password: string): Promise<LoginResult> {
    await connect();

    // make sure account doesn't already exist
    const user: IUser | null = await User.findOne({ username });
    if (user) return {
        ok: false,
        code: 409,
        error: "Username already exists."
    };

    // hash & salt the password, generate uuid
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const id = uuid();

    // insert user into database
    const newUser = new User({
        _id: id,
        username,
        password: hashedPassword
    });
    await newUser.save();

    return {
        ok: true,
        code: 201,
        data: { name: username, id }
    }
}