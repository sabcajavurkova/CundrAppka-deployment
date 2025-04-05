import mongoose from 'mongoose'

// connects backend to db
export const connectDB = async () => {
    const MONGO_URI = process.env.MONGO_URI

    // if there is no link to database in .env, print out a message and stop running
    if (!MONGO_URI) {
        console.error('URI databáze není definováno v .env')
        process.exit(1)
    }

    mongoose
        .connect(MONGO_URI)
        .then(() => {
            // once succesfully connected, prints out a message
            console.log('Databáze připojena')
        })
        .catch((err) => {
            console.error('Nastala chyba při připojování k databázi: ', err.message)
    })
}
