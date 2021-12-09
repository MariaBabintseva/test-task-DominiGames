import * as functions from "firebase-functions";
import * as express from "express";
import {
	AddGamer,
	addResources,
	DeleteGamer,
	getAllGamers,
	getAmountResources,
	getGamerById,
	getGamersByProperties,
	seeGivenGifts,
	seeSentGifts,
	SendGift,
	subtractResources,
	UpdateGamer,
} from "./gamersController";

const cors = require("cors");

const app = express();

app.use(cors());

app.get("/all", getAllGamers);

app.post("/", getGamersByProperties);

app.get("/:id", getGamerById);

app.get("/:id/resources", getAmountResources);

app.get("/:id/giftSent", seeSentGifts);

app.get("/:id/giftsGiven", seeGivenGifts);

app.post("/:id/give", SendGift);

app.post("/:id/addResources", addResources);

app.post("/:id/subtractResources", subtractResources);

app.post("/add", AddGamer);

app.put("/:id", UpdateGamer);

app.delete("/:id", DeleteGamer);

exports.gamer = functions.https.onRequest(app);
