import { ActionFormData } from '@minecraft/server-ui'

export default class {
	constructor(title, body) {
		this.form = new ActionFormData().title(title).body(body);
		this.buttons = new Map();
	}

	button(key, label, imageUrl = null) {
		if (imageUrl) {
			this.form.button(label, imageUrl);
		} else {
			this.form.button(label);
		}
		this.buttons.set(key, this.buttons.size);
		return this;
	}

	show(player) {
		return this.form.show(player).then(response => {
			if (response.isCanceled) {
				return { isCanceled: true };
			} else {
				const key = [...this.buttons.entries()].find(([key, index]) => index === response.selection)[0];
				return { isCanceled: false, selection: key };
			}
		}).catch(error => {
			console.error("Error showing form: ", error);
			throw error;
		});
	}
}