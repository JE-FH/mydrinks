import koa from "koa";
import { Controller, Get } from "koa-blocks/Decorator";
import { ServiceNetwork } from "koa-blocks/ServiceNetwork";
import EJSRenderer from "../services/EJSRenderer";

export default class SearchController extends Controller {
	ejs_renderer: EJSRenderer;
	constructor(service_network: ServiceNetwork) {
		super();
		this.ejs_renderer = service_network.get_by_type(EJSRenderer);
	}

	@Get("/")
	async index(ctx: koa.Context) {
		return await this.ejs_renderer.render_template("index.ejs", {});
	}
}