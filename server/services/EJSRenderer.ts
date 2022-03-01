import { PassiveService } from "koa-blocks/ServiceNetwork";
import {resolve, join} from "path";
import * as ejs from "ejs";
export default class EJSRenderer extends PassiveService {
	private template_folder: string;
	private use_cache: boolean;

	constructor(template_folder: string, use_cache?: boolean) {
		super();
		this.template_folder = template_folder;
		this.use_cache = use_cache ?? false;
	}

	async render_template(path: string, data: ejs.Data): Promise<string> {
		let real_path = resolve(join(this.template_folder, path));
		let template = await ejs.renderFile(real_path, data, {
			cache: this.use_cache,
			async: true
		});

		return template;
	}
}