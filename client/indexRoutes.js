const express = require('express');
const grpcRoutes = require('./index');

const router = express.Router();

router.get('/hospital', grpcRoutes.hospital);
router.get('/doctorProfessions', grpcRoutes.doctorProfessions);
router.get('/city', grpcRoutes.city);
router.get('/doctorList', grpcRoutes.doctorList);
router.get('/userLogin', grpcRoutes.userLogin);
router.get('/getUserData', grpcRoutes.getUserData);
router.get('/calculateBMI', grpcRoutes.calculateBMI);
router.get('/signUp', grpcRoutes.signUp)
router.get('/safeArea', grpcRoutes.safeArea)
//router.post('/upload',)

module.exports = router;