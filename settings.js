"use strict";

const ENV = process.env;

exports.JWT = {
	stepKey: ENV["JWT_STEP_KEY"],
	secretKey: ENV["JWT_SECRET_KEY"]
};

exports.CRUD = {
	host: ENV["CRUD_HOST"],
	port: ENV["CRUD_PORT"]
}
