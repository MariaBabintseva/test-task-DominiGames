import { Request, Response } from "express";

const admin = require("firebase-admin");
admin.initializeApp();

type GamerType = {
	id: string;
	name: string;
	power: number;
	resources: Resources;
	giftSent: GiftSentType[];
	giftsGiven: GiftsGivenType[];
};

type Resources = {
	coins: string;
	crystals: string;
};

type GiftSentType = {
	who: string;
	nameResourses: string;
	value: number;
};

type GiftsGivenType = {
	toWhom: string;
	nameResourses: string;
	value: number;
};

//Получить список всех игроков
const getAllGamers = async (req: Request, res: Response) => {
	try {
		const allGamers = await admin.firestore().collection("gamers").get();

		let gamers: GamerType[] = [];

		allGamers.forEach((doc: any) => {
			let id = doc.id;
			let data = doc.data();

			gamers.push({ id, ...data });
		});
		return res.status(200).send(JSON.stringify(gamers));
	} catch (error) {
		return res.status(500).send(JSON.stringify(error));
	}
};

//Получить игроков по свойству и добавить n ресурсов
const getGamersByProperties = async (req: Request, res: Response) => {
	const resources = req.body.resources;
	const value = req.body.value;
	const properties = req.body.properties;

	try {
		const allGamers = await admin
			.firestore()
			.collection("gamers")
			.where(properties, ">=", 0)
			.get();

		allGamers.forEach((gamer: GamerType) => {
			Add(gamer.id, resources, value);
		});

		return res.status(200).send(JSON.stringify({ status: "ok" }));
	} catch (error) {
		return res.status(500).send(JSON.stringify(error));
	}
};

//Получить игрока по id
const getGamerById = async (req: Request, res: Response) => {
	try {
		const gamer = await admin
			.firestore()
			.collection("gamers")
			.doc(req.params.id)
			.get();

		const gamerId = gamer.id;
		const gamerData = gamer.data();

		return res.status(200).send(JSON.stringify({ id: gamerId, ...gamerData }));
	} catch (error) {
		return res.status(500).send(JSON.stringify(error));
	}
};

//Получить количество ресурсов
const getAmountResources = async (req: Request, res: Response) => {
	try {
		const gamer = await admin
			.firestore()
			.collection("gamers")
			.doc(req.params.id)
			.get();

		const gamerData = gamer.data();
		const resources = gamerData.resources;

		return res.status(200).send(JSON.stringify({ ...resources }));
	} catch (error) {
		return res.status(500).send(JSON.stringify(error));
	}
};

//Посмотреть отправленные подарки
const seeSentGifts = async (req: Request, res: Response) => {
	try {
		const gamer = await admin
			.firestore()
			.collection("gamers")
			.doc(req.params.id)
			.get();

		const gamerData = gamer.data();
		const giftSent = gamerData.giftSent;

		return res.status(200).send(JSON.stringify(giftSent));
	} catch (error) {
		return res.status(500).send(JSON.stringify(error));
	}
};

//Посмотреть полученные подарки
const seeGivenGifts = async (req: Request, res: Response) => {
	try {
		const gamer = await admin
			.firestore()
			.collection("gamers")
			.doc(req.params.id)
			.get();

		const gamerData = gamer.data();
		const giftsGiven = gamerData.giftsGiven;

		return res.status(200).send(JSON.stringify(giftsGiven));
	} catch (error) {
		return res.status(500).send(JSON.stringify(error));
	}
};

//Добавить n единиц ресурсов для конкретного игрока по его id

const Add = async (id: string, resources: string, value: number) => {
	const gamer = await admin.firestore().collection("gamers").doc(id);

	await gamer.update({
		["resources." + resources]: admin.firestore.FieldValue.increment(value),
	});
};

//Вычесть n единиц ресурсов для конкретного игрока по его id
const Subtract = async (id: string, resources: string, value: number) => {
	const gamer = await admin.firestore().collection("gamers").doc(id);

	await gamer.update({
		["resources." + resources]: admin.firestore.FieldValue.increment(-value),
	});
};

//Кому отправить подарок

const toWhomGive = async (
	whoGiveId: string,
	toWhomId: string,
	resources: string,
	value: number
) => {
	const toWhom = await admin.firestore().collection("gamers").doc(toWhomId);

	await toWhom.update({
		giftSent: admin.firestore.FieldValue.arrayUnion({
			who: whoGiveId,
			nameResourses: resources,
			value: value,
		}),
	});

	Add(toWhomId, resources, value);
};

//Кто отправил подарок
const whoGive = async (
	whoGiveId: string,
	toWhomId: string,
	resources: string,
	value: number
) => {
	const whoGive = await admin.firestore().collection("gamers").doc(whoGiveId);

	await whoGive.update({
		giftsGiven: admin.firestore.FieldValue.arrayUnion({
			toWhom: toWhomId,
			nameResourses: resources,
			value: value,
		}),
	});
};

//Подарить подарок другому игроку или группе игроков
const SendGift = async (req: Request, res: Response) => {
	const resources = req.body.resources;
	const value = req.body.value;
	const arrayId = req.body.id;

	arrayId.forEach((id: string) => {
		whoGive(req.params.id, id, resources, value);

		toWhomGive(req.params.id, id, resources, value);
	});
	res
		.status(201)
		.send(
			JSON.stringify({ status: "ok", who: req.params.id, toWhom: arrayId })
		);
};

//Добавить ресурсы
const addResources = async (req: Request, res: Response) => {
	const resources = req.body.resources;
	const value = req.body.value;

	Add(req.params.id, resources, value);

	res.status(201).send(JSON.stringify({ status: "ok" }));
};

//Вычесть ресурсы
const subtractResources = async (req: Request, res: Response) => {
	const resources = req.body.resources;
	const value = req.body.value;

	Subtract(req.params.id, resources, value);

	res.status(201).send(JSON.stringify({ status: "ok" }));
};

//Добавить игрока
const AddGamer = async (req: Request, res: Response) => {
	req.body.giftSent = [];
	req.body.giftsGiven = [];

	await admin.firestore().collection("gamers").add(req.body);

	res.status(201).send(JSON.stringify({ status: "ok", gamer: req.body }));
};

//Редактировать данные игрока
const UpdateGamer = async (req: Request, res: Response) => {
	const body = req.body;
	console.log(body);

	await admin
		.firestore()
		.collection("gamers")
		.doc(req.params.id)
		.update({
			...body,
		});

	res.status(200).send();
};

//Удалить игрока
const DeleteGamer = async (req: Request, res: Response) => {
	await admin.firestore().collection("gamers").doc(req.params.id).delete();

	res.status(200).send();
};
export {
	getAllGamers,
	getGamersByProperties,
	getGamerById,
	getAmountResources,
	seeSentGifts,
	seeGivenGifts,
	SendGift,
	addResources,
	subtractResources,
	AddGamer,
	UpdateGamer,
	DeleteGamer,
};
