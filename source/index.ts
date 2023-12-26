type Lines = Array<string> | string

export interface Link {
	url: string
	inner: string
	title?: string
}

/** Escape characters that can interfere with HTML and Markdown attributes */
export function escapeAttribute(str: string): string {
	return str
		.replaceAll('&', '&amp;') // must be done first
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;') // double quote
		.replaceAll('[', '&#91;')
		.replaceAll(']', '&#93;')
		.replaceAll('(', '&#40;')
		.replaceAll(')', '&#41;')
		.replaceAll('`', '&#96;')
}

/** Combine lines that aren't empty */
export function lines(items: Lines): string {
	return typeof items === 'string' ? items : items.filter(Boolean).join('\n')
}

/** Join all lines */
export function join(items: Lines, join: string = '\n'): string {
	return typeof items === 'string' ? items : items.join(join)
}

/** Trim whitespace from the start and end */
export function trim(str: string): string {
	return str.replace(/^\s+|\s+$/g, '')
}

/** Wrap the item */
export function wrap(
	prefix: string = '',
	suffix: string = '',
	item: string,
): string {
	if (item) return `${prefix}${item}${suffix}`
	return ''
}

/** WRap each item */
export function wrapEach(
	prefix: string = '',
	suffix: string = '',
	items: Lines,
): Array<string> {
	if (typeof items === 'string') return [wrap(prefix, suffix, items)]
	return items.filter(Boolean).map((item) => wrap(prefix, suffix, item))
}

/** Wrap the item in a tag */
export function tag(name: string = '', item: string): string {
	return wrap(`<${name}>`, `</${name}>`, item)
}

/** Wrap each item in a tag */
export function tagEach(name: string = '', items: Lines): Array<string> {
	return wrapEach(`<${name}>`, `</${name}>`, items)
}

/** Render items conditionally */
export function i(condition: any, items: () => Lines): string {
	return condition ? lines(items()) : ''
}

/** Render text */
export function t(items: Lines): string {
	return typeof items === 'string' ? items : items.filter(Boolean).join(' ')
}

/** Render line break */
export function br(): string {
	return '<br/>'
}

/** Render HTML paragraph */
export function p(items: Lines): string {
	return tag('p', lines(items))
}

/** Render Markdown paragraph */
export function mp(items: Lines): string {
	return lines(items) + '\n'
}

/** Render HTML heading */
export function h(level: number, item: string): string {
	return tag(`h${level}`, item)
}

/** Render Markdown heading */
export function mh(level: number, item: string): string {
	return `${'#'.repeat(level)} ${item}\n`
}

/** Render HTML h1 */
export function h1(item: string): string {
	return h(1, item)
}

/** Render Markdown h1 */
export function mh1(item: string): string {
	return mh(1, item)
}

/** Render HTML h2 */
export function h2(item: string): string {
	return h(2, item)
}

/** Render Markdown h2 */
export function mh2(item: string): string {
	return mh(2, item)
}

/** Render HTML h3 */
export function h3(item: string): string {
	return h(3, item)
}

/** Render Markdown h3 */
export function mh3(item: string): string {
	return mh(3, item)
}

/** Render HTML h4 */
export function h4(item: string): string {
	return h(4, item)
}

/** Render Markdown h4 */
export function mh4(item: string): string {
	return mh(4, item)
}

/** Render HTML h5 */
export function h5(item: string): string {
	return h(5, item)
}

/** Render Markdown h5 */
export function mh5(item: string): string {
	return mh(5, item)
}

/** Render HTML h6 */
export function h6(item: string): string {
	return h(6, item)
}

/** Render Markdown h6 */
export function mh6(item: string): string {
	return mh(6, item)
}

/** Render HTML strong */
export function strong(item: string): string {
	return tag('strong', item)
}

/** Render Markdown strong */
export function mstrong(item: string): string {
	return `**${item}**`
}

/** Render HTML em */
export function em(item: string): string {
	return tag('em', item)
}

/** Render Markdown em */
export function mem(item: string): string {
	return `_${item}_`
}

/** Render HTML blockquote */
export function blockquote(items: Lines): string {
	return tag('blockquote', lines(items))
}

/** Render Markdown blockquote */
export function mblockquote(items: Lines): string {
	return wrapEach('> ', '', items).join('\n')
}

/** Render HTML pre */
export function pre(items: Lines): string {
	const content = join(items)
	if (!content) return ''
	return tag('pre', `\n${content}\n`)
}

/** Render HTML inline code */
export function code(item: string): string {
	return tag('code', item)
}

/** Render Markdown inline code */
export function mcode(item: string): string {
	return `\`${item}\``
}

/** Render Markdown code block */
export function mcodeblock(format: string, items: Lines): string {
	const backticks = '```'
	const header = format ? `${backticks} ${format}` : backticks
	return wrap(header + '\n', '\n' + backticks, join(items))
}

/** Render HTML list element */
export function li(items: Array<string>): string {
	return tagEach('li', items).join('\n')
}

/** Render HTML unordered list */
export function ul(items: Array<string>): string {
	return tag('ul', li(items))
}

/** Render Markdown unordered list */
export function mul(items: Array<string>): string {
	const content = wrapEach('-   ', '', items).join('\n')
	if (content) return content + '\n'
	return ''
}

/** Render HTML ordered list */
export function ol(items: Array<string>): string {
	return tag('ol', li(items))
}

/** Render Markdown ordered list */
export function mol(items: Array<string>): string {
	const content = wrapEach('1.  ', '', items).join('\n')
	if (content) return content + '\n'
	return ''
}

/** Render HTML link */
export function a({ url, inner, title }: Link): string {
	if (!url || !inner) {
		throw new Error('Links must have both url and inner properties')
	}
	if (title) {
		return `<a href="${url}" title="${escapeAttribute(title)}">${inner}</a>`
	} else {
		return `<a href="${url}">${inner}</a>`
	}
}

/** Render Markdown link */
export function ma({ url, inner, title }: Link): string {
	if (!url || !inner) {
		throw new Error('Links must have both url and inner properties')
	}
	if (title) return `[${inner}](${url} "${escapeAttribute(title)}")` // @todo select ' or " to conform with prettier
	return `[${inner}](${url})`
}
