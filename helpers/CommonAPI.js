import nodemailer from 'nodemailer';
import mandrillTransport from 'nodemailer-mandrill-transport/lib/mandrill-transport';
import fs from 'fs';
import AWS from 'aws-sdk';
import nodemailerSendgrid from 'nodemailer-sendgrid'
AWS.config = new AWS.Config(process.env.aws.configuration);
const spacesEndpoint = new AWS.Endpoint("s3.amazonaws.com");
const s3Object = new AWS.S3({
	endpoint: spacesEndpoint,
});

let defaultOptions = {
	returnFullPath: false,
	ACL: "public-read",
	filename: null
};

const s3Params = {
	Bucket: process.env.aws.bucket,
};

const CommonAPI = {};

CommonAPI.sendMailUsingMandrill = async( params = null, settings) => {
	return new Promise( (resolve, reject) => {
		var transport = nodemailer.createTransport(mandrillTransport({
			auth: {
				apiKey: settings.mandrillKey
			}
		}));
		
		transport.sendMail({
			from: 'Support <bhall@indiepax.com>',
			to: params.to,
			subject: params.subject,
			html: params.html
		}, function(err, info) {
			if (err) {
				console.error("err", err);
				reject(err);
			} else {
				console.log("info",info);
				resolve(info)
			}
		});
	})
}

CommonAPI.sendMailUsingSMTP = async (params = null, settings) => {
	return new Promise((resolve, reject) => {
		var transport = nodemailer.createTransport({
			host: settings.smtpHost,
			port: settings.smtpPort,
			auth: {
				user: settings.smtpUsername,
				pass: settings.smtpPassword
			}
		});
		transport.sendMail({
			from: 'Support <bhall@indiepax.com>',
			to: params.to,
			subject: params.subject,
			html: params.html
		}, function(err, info) {
			if (err) {
				console.error("err", err);
				reject(err);
			} else {
				console.log("info",info);
				resolve(info)
			}
		});
	})
}


CommonAPI.sendMailUsingSendgrid = async (params = null, settings) => {
	return new Promise((resolve, reject) => {
		let transport = nodemailer.createTransport(
			nodemailerSendgrid({
				 apiKey: settings.sendgridKey
			  })
			);
		transport.sendMail({
			from: 'Support <bhall@indiepax.com>',
			to: params.to,
			subject: params.subject,
			html: params.html
		}, function(err, info) {
			if (err) {
				console.error("err", err);
				reject(err);
			} else {
				console.log("info",info);
				resolve(info)
			}
		});
	})
}


CommonAPI.upload = (localFile, remotePath, options = {}) => {
	options = {
		...defaultOptions,
		...options,
	};
	return new Promise((resolve, reject) => {
		let p = Object.assign({}, s3Params);
		p.Key = remotePath;
		p.ACL = options.ACL;
		if (options.ContentType) {
			p.ContentType = options.ContentType;
		}
		// if (options.filename) {
		// 	p.ContentDisposition = `attachment;filename=${options.filename}`;
		// }
		let uploader = new AWS.S3.ManagedUpload({
			params: {
				Body: fs.readFileSync(localFile),
				...p,
			},
		}).promise();

		uploader.then(
			function (data) {
				fs.unlinkSync(localFile);
				let url = data.Key;
				data.cdnURL = process.env.s3URL.concat(url);
				if (options.returnFullPath) {
					url = bucketBase.concat(url);
				}
				resolve({ url, data });
			},
			function (err) {
				reject(err.toString());
			}
		);
	});
};

CommonAPI.deleteObjects = (remotePaths = []) => {
	return new Promise((resolve, reject) => {
		let deleteParams = Object.assign({}, s3Params);

		deleteParams.Delete = { Objects: [] };
		for (let path of remotePaths) {
			deleteParams.Delete.Objects.push({ Key: path });
		}

		s3Object.deleteObjects(deleteParams, async (err, data) => {
			if (err) {
				reject("error while deleting objects from s3" + err);
				console.error("error while deleting objects from s3" + err);
				return;
			}
			resolve(1);
		});
	});
};

CommonAPI.copyObject = async (source, target) => {
	return new Promise(async (resolve, reject) => {
		let params = Object.assign({}, s3Params);
		params.CopySource = s3Params.Bucket + "/" + source;
		params.Key = target;
		params.ACL = defaultOptions.ACL;
		s3Object.copyObject(params, async (err, data) => {
			if (err) {
				reject("error while coping objects from s3" + err);
				console.error("error while coping objects from s3" + err);
				return;
			}
			resolve({ key: target, url: process.env.s3URL + target });
		});
	});
};

CommonAPI.getAllkeysOfFolder = (folder) => {
	return new Promise((resolve, reject) => {
		s3Object.listObjectsV2(s3Params, function (err, data) {
			if (err) reject({ status: 0 });
			if (data.Contents.length == 0) resolve({ status: 0 });
			let keys = [];
			data.Contents.forEach(function (content) {
				if (content.Key.indexOf(folder) !== -1) {
					keys.push(content.Key);
				}
			});
			if (keys.length) resolve({ status: 1, keys: keys });
			else resolve({ status: 0 });
		});
	});
};

export default CommonAPI;
