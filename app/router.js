'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
	const { router, controller } = app;
	router.get('/', controller.home.index);

	// router.post('/drawImage', controller.home.drawOld);
	router.post('/drawImage', controller.home.draw);
	router.post('/historyBill', controller.home.historyBill);
	router.post('/drawTradeCertificate', controller.drawTradeCertificate.tradeCertificate);
};
