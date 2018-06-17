module.exports = {
	loadVariables: (message, inputs) => {
		const broken = message.text.split('{{');
		let newMessage = '';
		if (broken.length > 1) {
			broken.map(section => {
				const brokenSection = section.split('}}');
				if (brokenSection.length > 1) {
					const variableName = brokenSection[0].replace(/ /g, '');
					newMessage += inputs[variableName];
					newMessage += brokenSection[1];
				} else {
					newMessage += brokenSection[0];
				}
			});
		}
		if (newMessage.length > 0) {
			message.text = newMessage;
		}
		return message;
	}
}