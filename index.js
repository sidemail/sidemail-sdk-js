const fetch = require("node-fetch");

const { SidemailError } = require("./errors");

const DEFAULT_HOST = "https://api.sidemail.io";
const DEFAULT_BASE_PATH = "/v1/";

class Sidemail {
	constructor({ apiKey, host }) {
		this.apiKey = apiKey;
		this.host = host || DEFAULT_HOST;
	}

	getApiUrl(path) {
		return this.host + DEFAULT_BASE_PATH + path;
	}

	async performApiRequest(path, data) {
		const response = await fetch(this.getApiUrl(path), {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				Accept: "application/json",
				Authorization: "Bearer " + this.apiKey,
				"Content-Type": "application/json",
			},
		});

		const contentType = response.headers.get("content-type");

		if (!contentType.includes("application/json")) {
			throw new TypeError(
				`Expected JSON response. Received ${contentType} instead.`
			);
		}

		const json = await response.json();

		if (!response.ok) {
			throw new SidemailError(json);
		}

		return json;
	}

	async sendMail(data) {
		const response = await this.performApiRequest("mail/send", data);

		return response;
	}
}

module.exports = function configureSidemail(config) {
	return new Sidemail(config);
};
