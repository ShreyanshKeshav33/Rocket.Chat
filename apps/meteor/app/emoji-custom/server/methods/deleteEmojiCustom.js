import { Meteor } from 'meteor/meteor';
import { EmojiCustom } from '@rocket.chat/models';
import { api } from '@rocket.chat/core-services';

import { hasPermission } from '../../../authorization/server';
import { RocketChatFileEmojiCustomInstance } from '../startup/emoji-custom';

Meteor.methods({
	async deleteEmojiCustom(emojiID) {
		if (!hasPermission(this.userId, 'manage-emoji')) {
			throw new Meteor.Error('not_authorized');
		}

		const emoji = await EmojiCustom.findOneById(emojiID);
		if (emoji == null) {
			throw new Meteor.Error('Custom_Emoji_Error_Invalid_Emoji', 'Invalid emoji', {
				method: 'deleteEmojiCustom',
			});
		}

		RocketChatFileEmojiCustomInstance.deleteFile(encodeURIComponent(`${emoji.name}.${emoji.extension}`));
		await EmojiCustom.removeById(emojiID);
		api.broadcast('emoji.deleteCustom', emoji);

		return true;
	},
});
