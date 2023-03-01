/** @module Routes */
import cors from "cors";
import {FastifyInstance, FastifyReply, FastifyRequest, RouteShorthandOptions} from "fastify";
import {User} from "./db/models/user";
import {IPHistory} from "./db/models/ip_history";
import {Profile} from "./db/models/profile";
import {Match} from "./db/models/match"
import { DataSource } from "typeorm";
import { match } from "assert";
import { m } from "vitest/dist/types-aac763a5";

/**
 * App plugin where we construct our routes
 * @param {FastifyInstance} app our main Fastify app instance
 */
export async function doggr_routes(app: FastifyInstance): Promise<void> {

	// Middleware
	// TODO: Refactor this in favor of fastify-cors
	app.use(cors());

	/**
	 * Route replying to /test path for test-testing
	 * @name get/test
	 * @function
	 */
	app.get("/test", async (request: FastifyRequest, reply: FastifyReply) => {
		reply.send("GET Test");
	});

	/**
	 * Route serving login form.
	 * @name get/users
	 * @function
	 */
	app.get("/users", async (req, reply) => {
		let users = await app.db.user.find();
		reply.send(users);
	});

	// CRUD impl for users
	// Create new user

	// Appease fastify gods
	const post_users_opts: RouteShorthandOptions = {
		schema: {
			body: {
				type: 'object',
				properties: {
					name: {type: 'string'},
					email: {type: 'string'}
				}
			},
			response: {
				200: {
					type: 'object',
					properties: {
						user: {type: 'object'},
						ip_address: {type: 'string'}
					}
				}
			}
		}
	};

	/**
	 * Route allowing creation of a new user.
	 * @name post/users
	 * @function
	 * @param {string} name - user's full name
	 * @param {string} email - user's email address
	 * @returns {IPostUsersResponse} user and IP Address used to create account
	 */
	app.post<{
		Body: IPostUsersBody,
		Reply: IPostUsersResponse
	}>("/users", post_users_opts, async (req, reply: FastifyReply) => {

		const {name, email} = req.body;

		const user = new User();
		user.name = name;
		user.email = email;

		const ip = new IPHistory();
		ip.ip = req.ip;
		ip.user = user;
		// transactional, transitively saves user to users table as well IFF both succeed
		await ip.save();

		//manually JSON stringify due to fastify bug with validation
		// https://github.com/fastify/fastify/issues/4017
		await reply.send(JSON.stringify({user, ip_address: ip.ip}));
	});


	// PROFILE Route
	/**
	 * Route listing all current profiles
	 * @name get/profiles
	 * @function
	 */
	app.get("/profiles", async (req, reply) => {
		let profiles = await app.db.profile.find();
		reply.send(profiles);
	});

	app.post("/profiles", async (req: any, reply: FastifyReply) => {

		const {name} = req.body;

		const myUser = await app.db.user.findOneByOrFail({});

	  	const newProfile = new Profile();
	  	newProfile.name = name;
		newProfile.picture = "ph.jpg";
		newProfile.user = myUser;

		await newProfile.save();

		//manually JSON stringify due to fastify bug with validation
		// https://github.com/fastify/fastify/issues/4017
		await reply.send(JSON.stringify(newProfile));
	});

	app.delete("/profiles", async (req: any, reply: FastifyReply) => {

		const myProfile = await app.db.profile.findOneByOrFail({});
		let res = await myProfile.remove();

		//manually JSON stringify due to fastify bug with validation
		// https://github.com/fastify/fastify/issues/4017
		await reply.send(JSON.stringify(res));
	});

	app.put("/profiles", async(request, reply) => {
		const myProfile = await app.db.profile.findOneByOrFail({});


		myProfile.name = "APP.PUT NAME CHANGED";
		let res = await myProfile.save();

		//manually JSON stringify due to fastify bug with validation
		// https://github.com/fastify/fastify/issues/4017
		await reply.send(JSON.stringify(res));
	});

	//Match Route
	/**
	 * Route listing all current profiles
	 * @name get/profiles
	 * @function
	 */

	//1) GET /matches - Show every match for every profile
	//Do I need to have a matches file?
	app.get("/matches", async (request: FastifyRequest, reply: FastifyReply) => {

		let matches = await app.db.match.find({
			select: {
				id: true,
				name: true,
				picture: true,
			},	
			relations: {
				matchee: true
			},
			where: {
				matcher: true,
			}
		});

		reply.send(JSON.stringify(matches)).status(200);
	});

	//2) POST /match { matcherId, matcheeId } - 
	//Take these two pieces of data and create a 
	//new Match from matcher(matcherId) to matchee(matcheeId)
	app.post("/match", async (req: any, reply: FastifyReply) => {

		const {matcherID, matcheeID} = req.body;

		const newMatch = new Match();
		
		//newMatch.name = matcherID.name;
		//newMatch.picture = matcherID.picture;
		newMatch.matchee = matcheeID;
		newMatch.matcher = matcherID;

		await newMatch.save();
		//manually JSON stringify due to fastify bug with validation
		// https://github.com/fastify/fastify/issues/4017
		//await reply.send(JSON.stringify(myMatch));
		reply.send(JSON.stringify(newMatch)).status(200);
	});

	//3) DELETE /match { matcherId, matcheeId } - 
		//Delete any resulting Match from 
		//matcher(matcherId) to matchee(matcheeId)
	app.delete("/match", async (req: any, reply: FastifyReply) => {

		const {matcherID, matcheeID} = req.body;
		const myMatch = await app.db.match.find({
			//define find options
			select: {},
			relations: {
				matcher: matcherID,
			},
			where: {
				matchee: matcheeID,
			},
		});
		let res = await myMatch.pop();

		//manually JSON stringify due to fastify bug with validation
		// https://github.com/fastify/fastify/issues/4017
		await reply.send(JSON.stringify(res));
	});

	//4) DELETE /matches { matcherId } - 
	//	 Delete ALL of a profile's matches based on matcherId
	app.delete("/matches", async (req: any, reply: FastifyReply) => {

		const { matcherID } = req.body;
		const myMatches = await app.db.match.find({
			//define find options
			select: {},
			relations: {
				matchee: true,
			},
			where: {
				matcher: matcherID,
			},
		});

		let res = myMatches.forEach(() => {
			myMatches.pop();
		});
		//let res = await myMatches.pop();

		//manually JSON stringify due to fastify bug with validation
		// https://github.com/fastify/fastify/issues/4017
		await reply.send(JSON.stringify(res)).status(200);
	});

	//5) GET /match { matcherId }  
	//	 Get every "Matchee" a profile has ever matched with
	app.get("/match", async (request: any, reply: FastifyReply) => {
		const { matcherID } = request.body;
		let match = await app.db.match.find({
			//define find options
			//where : matcherID
			select: {
				id: true,
				name: true,
				picture: true,
			},
			relations: {
				matchee: true,
			},
			where: {
				id: matcherID,
			},
		});
		reply.send(JSON.stringify(match)).status(200);
	});

	//6) GET /matchee { matcheeId } - 
	//	 Get every "Matcher" profile who has matched with said matcheeId
	app.get("/matchee", async (req: any, reply: FastifyReply) => {
		const {matcheeID} = req.body;
		let match = await app.db.match.find({
			//define find options
			//where: matcheeID
			select: {
				id: true,
				name: true,
				picture: true,
			},
			relations: {
				matcher: true
			},
			where: {
				id: matcheeID,
			},
		});
		reply.send(JSON.stringify(match)).status(200);
	});

/**
 * @BONUS bonus/questions
 */

	app.post("/match/:message", async (req: any, reply: FastifyReply) => {
		const {matcherID, matcheeID, message} = req.body;
		let match = await app.db.match.find({
			//define find options
			//where: matcheeID
			select: {
				messages: true,
			},
			relations: {
				matcher: matcherID
			},
			where: {
				id: matcheeID,
			},
		});
		match.push(message);
		reply.send(JSON.stringify(match)).status(200);
	});

	app.put("/match", async(request: any, reply: FastifyReply) => {
		const myMatch = await app.db.match.findOneByOrFail({});


		myMatch.name = "APP.PUT NAME CHANGED";
		let res = await myMatch.save();

		//manually JSON stringify due to fastify bug with validation
		// https://github.com/fastify/fastify/issues/4017
		await reply.send(JSON.stringify(res));
	});

}

// Appease typescript request gods
interface IPostUsersBody {
	name: string,
	email: string,
}

/**
 * Response type for post/users
 */
export type IPostUsersResponse = {
	/**
	 * User created by request
	 */
	user: User,
	/**
	 * IP Address user used to create account
	 */
	ip_address: string
}
