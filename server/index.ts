import express, { Request, Response } from 'express'
import cors from 'cors'
import { Pool } from 'pg'
const query = require('./query')
const hash = require('object-hash')
const multer = require('multer')

const port = 8000;
const app = express();

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: DestinationCallback) => {
    cb(null, 'images')
  },
  filename: async (req: Request, file: Express.Multer.File, cb: FileNameCallback) => {
    const name = hash(req.query.email) + '.png'
    await cb(null, name)
  }
})

const upload = multer({ storage: storage })

app.use(cors())
app.use(express.static("./"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432")
})

const execute = async (query: any) => {
  try {
    await pool.connect();     // gets connection
    await pool.query(query);  // sends queries
    return true;
  } catch (error: any) {
    console.error(error.stack);
    return false;
  }
  // finally {
  //   await pool.end();         // closes connection
  // }
};

const text = `
CREATE TABLE IF NOT EXISTS public."user"
(
    email character varying COLLATE pg_catalog."default" NOT NULL,
    name character varying COLLATE pg_catalog."default" NOT NULL,
    password character varying COLLATE pg_catalog."default" NOT NULL,
    avatar character varying COLLATE pg_catalog."default"
);`

execute(text).then(result => {
  if (result) {
    console.log('Table created');
  }
});

const connectToDB = async () => {
  try {
    await pool.connect();
  } catch (err) {
    console.log(err);
  }
};
connectToDB();

app.get('/api/user', async (req: Request, res: Response) => {
  const user = await pool.query(query.get_user_info, [req.params.email])

  res.send(user?.rows?.[0])
});

app.post('/api/user', (req: Request, res: Response) => {
  const { name, email, password } = req.body
  pool.query(query.create_user, [name, email, hash(password)], (error) => {
    if (error) res.status(400).send(error)
    else res.status(200).send('User has been saved')
  })
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body
  const user = await pool.query(query.login, [email, hash(password)])
  res.send(user?.rows?.[0])
});

app.patch('/api/user', upload.single('image'), async (req: Request, res: Response) => {
  const filePath = `http://localhost:${port}/images/` + hash(req.query.email) + '.png'
  await pool.query(query.set_avatar, [req.query.email, filePath])
  const user = await pool.query(query.get_user_info, [req.query.email])
  res.send(user?.rows?.[0])
});

app.listen(port);
console.log(`Serving at http://localhost:${port}`);