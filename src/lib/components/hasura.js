// normal JSON.stringify returns a string where the key properties are also surroudned by quotes, this is not how graphql wants the values passed
const JSONToGraphqlArgs = (json) => {
	const unquoted = json.replace(/"([^"]+)":/g, '$1:');
	return unquoted;
};

/**
 * Converts any JS object to graphql argument.
 *
 * @param {object} object - the object param
 * @return {string} graphql argument
 *
 */
const objectToGraphqlArgs = (object) => {
	const json = JSON.stringify(object);
	const str = JSONToGraphqlArgs(json);
	return str.slice(1, str.length - 1);
};

/**
 * Converts any JS object to Hasura graphql mutation argument.
 *
 * @param {object} obj - the object param
 * @return {string} graphql argument
 *
 */
const objectToGraphqlMutationArgs = (obj) => {
	// bracket_type = [parentheses, square_brackets, angle_brackets and curly_brackets]
	const _findClosingBracketMatchIndex = (
		str,
		pos,
		bracket_type = 'parentheses'
	) => {
		const bracket_map = {
			parentheses: ['(', ')'],
			square_brackets: ['[', ']'],
			angle_brackets: ['<', '>'],
			curly_brackets: ['{', '}'],
		};

		const selected_bracket_type = bracket_map[bracket_type];
		if (!selected_bracket_type) {
			throw new Error('Not a valid bracket type');
		}
		if (str[pos] != selected_bracket_type[0]) {
			throw new Error(`No '${selected_bracket_type[0]}' at index ` + pos);
		}
		let depth = 1;
		for (let i = pos + 1; i < str.length; i++) {
			switch (str[i]) {
				case selected_bracket_type[0]:
					depth++;
					break;
				case selected_bracket_type[1]:
					if (--depth == 0) {
						return i;
					}
					break;
			}
		}
		return -1; // No matching closing parenthesis
	};

	const _getIndicesOf = (searchStr, str, caseSensitive) => {
		var searchStrLen = searchStr.length;
		if (searchStrLen == 0) {
			return [];
		}
		var startIndex = 0,
			index,
			indices = [];
		if (!caseSensitive) {
			str = str.toLowerCase();
			searchStr = searchStr.toLowerCase();
		}
		while ((index = str.indexOf(searchStr, startIndex)) > -1) {
			indices.push(index);
			startIndex = index + searchStrLen;
		}
		return indices;
	};

	let obj_str = JSON.stringify(obj);
	const replace_arr = [];

	const indicies_of_square = _getIndicesOf(':[', obj_str, 0);
	const indicies_of_curly = _getIndicesOf(':{', obj_str, 0);

	indicies_of_square.forEach((index) => {
		// '{data: []}'
		replace_arr.push({
			index,
			chars: 2, // needed to know how many chars to replace from the index
			str: ':{"data":[',
		});
		const actual_index = index + 1; // starts with a colon instead
		const end_index = _findClosingBracketMatchIndex(
			obj_str,
			actual_index,
			'square_brackets'
		);
		replace_arr.push({
			index: end_index,
			chars: 1,
			str: ']}',
		});
	});

	indicies_of_curly.forEach((index) => {
		// '{data: {}}'
		replace_arr.push({
			index,
			chars: 2,
			str: ':{"data":{',
		});
		const actual_index = index + 1; // starts with a colon instead
		const end_index = _findClosingBracketMatchIndex(
			obj_str,
			actual_index,
			'curly_brackets'
		);
		replace_arr.push({
			index: end_index,
			chars: 1,
			str: '}}',
		});
	});

	replace_arr
		.sort((a, b) => b.index - a.index) // sorting was necessary to the string will be replaced from the end, preventing the previously calculated index from changing
		.forEach((to_be_replaced) => {
			const { index, chars, str } = to_be_replaced;
			obj_str = obj_str.slice(0, index) + str + obj_str.slice(index + chars);
		});

	if (obj_str[0] == '{') {
		obj_str = '"object":' + obj_str;
	} else if (obj_str[0] == '[') {
		obj_str = '"objects":' + obj_str;
	}

	return JSONToGraphqlArgs(obj_str);
};

export { objectToGraphqlArgs, objectToGraphqlMutationArgs };
