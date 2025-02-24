import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

import { User, IUser, Scrapbook, IScrapbook, Page } from './models';

const DB_URI = process.env.DB_URI;
const NO_URI_ERR = 'Please define the MONGODB_URI environment variable inside .env.local';

if (!DB_URI) console.error(NO_URI_ERR);


/**
 * Generic type for database operation results
 * @template T The type of data returned on successful operations
 */
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

/**
 * Establishes connection to MongoDB database
 * @async
 */
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
}

/** Type definition for login operation results */
type LoginResult = DBResult<{
    name: string,
    id: string
}>;

/**
 * Authenticates a user with username and password
 * @async
 * @param {string} username - The user's username
 * @param {string} password - The user's password
 * @returns {Promise<LoginResult>} Result of login attempt
 */
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

/**
 * Registers a new user in the database
 * @async
 * @param {string} username - The desired username
 * @param {string} password - The user's password
 * @returns {Promise<LoginResult>} Result of registration attempt
 */
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

/**
 * Creates a new scrapbook for a user
 * @async
 * @param {string} owner - The user ID of the scrapbook owner
 * @param {Partial<IScrapbook>} data - data related to scrapbook (title, visibility, width, height)
 * @returns {Promise<DBResult<IScrapbook>>} Result of scrapbook creation
 */
export async function createScrapbook(owner: string, data: Partial<IScrapbook>): Promise<DBResult<IScrapbook>> {
    await connect();
    const id = uuid();

    // added width/height
    const newScrapbook: IScrapbook = {
        _id: id,
        owner,
        title: data.title || "Untitled Scrapbook",
        visibility: data.visibility || "public",
        pages: [{ number: 1, elements: [] }],
        likes: [],
        width: data.width || 816,
        height: data.height || 1056
    };

    try {
        const query = new Scrapbook(newScrapbook);
        await query.save();
        return { ok: true, code: 201, data: newScrapbook };
    } catch (e) {
        console.error("Error creating scrapbook: ", e);
        return { ok: false, code: 500, error: "Error creating scrapbook" };
    }
}

/**
 * Retrieves scrapbooks from the database
 * @async
 * @param {string} [owner] - Optional owner ID to filter scrapbooks
 * @returns {Promise<DBResult<IScrapbook[]>>} Array of matching scrapbooks
 * @description If owner is provided, returns all scrapbooks for that user.
 * If no owner is provided, returns only public scrapbooks.
 */
export async function getScrapbooks(owner?: string): Promise<DBResult<IScrapbook[]>> {
    await connect();
    try {
        // if an owner is provided, get their scrapbooks
        // if no owner is provided, only return public scrapbooks
        const query = owner ? { owner } : { visibility: "public" };
        const scrapbooks: IScrapbook[] = await Scrapbook.find(query);
        return { ok: true, code: 200, data: scrapbooks };
    } catch (e) {
        console.log("Error getting scrapbooks: ", e);
        return { ok: false, code: 500, error: "Error getting scrapbooks" };
    }
}

/**
 * Retrieves a scrapbook by its ID
 * @async
 * @param {string} id - The ID of the scrapbook
 * @returns {Promise<DBResult<IScrapbook>>} Result of scrapbook retrieval
 */
export async function getScrapbook(id: string, owner?: string): Promise<DBResult<IScrapbook>> {
    await connect();
    try {
        const scrapbook: IScrapbook | null = await Scrapbook.findById(id);
        if (!scrapbook) return { ok: false, code: 404, error: "Scrapbook not found" };
        if (scrapbook.visibility == "private" && owner != scrapbook.owner)
            return { ok: false, code: 403, error: "Unauthorized"}
        return { ok: true, code: 200, data: scrapbook };
    } catch (e) {
        console.log("Error getting scrapbook: ", e);
        return { ok: false, code: 500, error: "Error getting scrapbook" };
    }
}

/**
 * Updates a scrapbook in the database
 * @async
 * @param {IScrapbook} scrapbook - The scrapbook object to update
 * @param {string} owner - The user ID of the scrapbook owner
 * @returns {Promise<DBResult<IScrapbook>>} Result of scrapbook update
 */
export async function saveScrapbook(scrapbook: IScrapbook, owner: string): Promise<DBResult<IScrapbook>> {
    await connect();
    try {
        // make sure scrapbook exists and owner is authorized
        const previousScrapbook = await Scrapbook.findById(scrapbook._id);
        if (!previousScrapbook) return { ok: false, code: 404, error: "Scrapbook not found" };
        if (previousScrapbook.owner != owner) return { ok: false, code: 403, error: "Unauthorized" };

        // update scrapbook
        const updatedScrapbook = await Scrapbook.findByIdAndUpdate(scrapbook._id, scrapbook);
        return { ok: true, code: 200, data: updatedScrapbook };
    } catch (e) {
        console.log("Error updating scrapbook: ", e);
        return { ok: false, code: 500, error: "Error updating scrapbook" };
    }
}