// eslint-disable-next-line strict
exports.cluster = {
	listen: {
		port: 7001,
		hostname: '127.0.0.1', // 不建议设置 hostname 为 '0.0.0.0'，它将允许来自外部网络和来源的连接，请在知晓风险的情况下使用
		// path: '/var/run/egg.sock',
	},
};
