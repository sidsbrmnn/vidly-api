# vidly-api

This project is the backend of Vidly, an imaginary video rental app which was a part of a course on Udemy.

This branch consists of the same code in Typescript.

## Installation

Have Node.js installed. Set an environment variable called `JWT_SECRET` with some value that'll act as a secret key for encoding the jsonwebtoken.

The other environment variables are

-   PORT
-   NODE_ENV
-   MONGODB_URI

These 3 environment variables are optional. All of those variables can be set using a `.env` file in the root of the folder.

To install all the dependencies, run

```bash
npm install
```

To populate the database with some initial values, run

```bash
npm run seed
```

For a production build, run

```bash
npm run build
```

For a development build, run

```bash
npm run dev
```

## Contribution

Feel free to fork the repository, fix any errors and make a pull request.

## License

`MIT License

Copyright (c) 2019 Siddharth Subramanian

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`
