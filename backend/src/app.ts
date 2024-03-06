import express, { Express } from "express";

const app: Express = express();

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`SERVER WAS STARTED AT ${PORT}`);
});

export {app}
