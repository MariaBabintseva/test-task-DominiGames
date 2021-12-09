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

async function getAll(): Promise<void> {
	return await fetch(
		"https://us-central1-test-task-dominigames-bf49e.cloudfunctions.net/gamer/All"
	)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			console.log("Игрок", data);
		})
		.catch(function (error) {
			console.log("error", error);
		});
}

async function getGamerById(id: string): Promise<void> {
	return await fetch(
		`https://us-central1-test-task-dominigames-bf49e.cloudfunctions.net/gamer/${id}`
	)
		.then(function (response) {
			return response.json();
		})
		.then(function (data: GamerType) {
			console.log("Игрок", data);
		})
		.catch(function (error) {
			console.log("error", error);
		});
}

async function getAmountResources(id: string): Promise<void> {
	return await fetch(
		`https://us-central1-test-task-dominigames-bf49e.cloudfunctions.net/gamer/${id}/resources`
	)
		.then(function (response) {
			return response.json();
		})
		.then(function (data: Resources) {
			console.log("Ресурсы:", data);
		})
		.catch(function (error) {
			console.log("error", error);
		});
}

async function seeSentGifts(id: string): Promise<void> {
	return await fetch(
		`https://us-central1-test-task-dominigames-bf49e.cloudfunctions.net/gamer/${id}/giftSent`
	)
		.then(function (response) {
			return response.json();
		})
		.then(function (data: GiftSentType) {
			console.log("Отправленные подарки:", data);
		})
		.catch(function (error) {
			console.log("error", error);
		});
}

async function seeGivenGifts(id: string): Promise<void> {
	return await fetch(
		`https://us-central1-test-task-dominigames-bf49e.cloudfunctions.net/gamer/${id}/giftsGiven`
	)
		.then(function (response) {
			return response.json();
		})
		.then(function (data: GiftsGivenType) {
			console.log("Полученные подарки:", data);
		})
		.catch(function (error) {
			console.log("error", error);
		});
}

async function SendGift(
	idSender: string,
	idRecipient: Array<string>,
	resources: string,
	value: number
): Promise<void> {
	return await fetch(
		`https://us-central1-test-task-dominigames-bf49e.cloudfunctions.net/gamer/${idSender}/give`,
		{
			method: "post",
			body: JSON.stringify({
				id: idRecipient,
				resources: resources,
				value: value,
			}),
			headers: {
				"content-type": "application/json",
			},
		}
	)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			console.log("Отправлен:", data);
		})
		.catch(function (error) {
			console.log("error", error);
		});
}

async function getGamersByProperties(
	properties: string,
	resources: string,
	value: number
): Promise<void> {
	return await fetch(
		"https://us-central1-test-task-dominigames-bf49e.cloudfunctions.net/gamer",
		{
			method: "post",
			body: JSON.stringify({
				properties: properties,
				resources: resources,
				value: value,
			}),
			headers: {
				"content-type": "application/json",
			},
		}
	)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			console.log("Отправлен:", data);
		})
		.catch(function (error) {
			console.log("error", error);
		});
}
getAll();

getGamerById("KzaornfmwJL8q38otCxk");

getGamersByProperties("dexterity", "coins", 10);

getAmountResources("KzaornfmwJL8q38otCxk");
seeSentGifts("KzaornfmwJL8q38otCxk");
seeGivenGifts("KzaornfmwJL8q38otCxk");

SendGift(
	"1WC282QdL1zg8FJizTEy",
	["1tSRRAbokb0aYMlopcq4", "KzaornfmwJL8q38otCxk"],
	"coins",
	100
);
