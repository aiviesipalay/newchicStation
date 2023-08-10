const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { employeeSchemaValidation, serviceSchemaValidation   } = require('../../schemas');
const ExpressError = require('../../utils/ExpressError');
const upload = require('../../utils/multer');
const {isLoggedIn} = require('../../middleware');


// Middlewares
const validateEmployee = (req, res, next) => {
  const { error } = employeeSchemaValidation.validate(req.body.employeeName);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};


const validateService = (req, res, next) => {
  const { error } = serviceSchemaValidation.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};



// const validateImage = (req, res, next) => {
//   const { error } = imageSchemaValidation.validate(req.body);
//   if (error) {
//     const msg = error.details.map((el) => el.message).join(',');
//     throw new ExpressError(msg, 400);
//   } else {
//     next();
//   }
// };









router.get('/dashboard', isLoggedIn,serviceController.renderDashboardPage);


router.get('/partials',isLoggedIn, serviceController.getActivityLog);


// Employee Routes
router.get('/records', isLoggedIn,serviceController.allRecords);
router.get('/records/new-record-form', isLoggedIn, serviceController.newRecordForm);
router.post('/records', validateEmployee, isLoggedIn, serviceController.saveRecord);
router.get('/records/:id', isLoggedIn, serviceController.viewRecord);
router.get('/records/:id/update-record', isLoggedIn,serviceController.updateRecordForm);
router.put('/records/:id', validateEmployee,isLoggedIn, serviceController.updateRecord);
router.delete('/records/:id',isLoggedIn, serviceController.deleteRecord);

// Services Routes
router.get('/ListService', isLoggedIn, serviceController.allServices);
router.get('/ListService', isLoggedIn,serviceController.newServiceForm);
// Fetch current service values
router.get('/ListService/:id', isLoggedIn, serviceController.getService);
router.post('/ListService',isLoggedIn, validateService, serviceController.saveService);
router.put('/ListService/:id',isLoggedIn, validateService, serviceController.updateService);
router.delete('/ListService/:id',isLoggedIn, serviceController.deleteService);

//upload image

router.get('/images', isLoggedIn, serviceController.viewImage);
router.post('/images', isLoggedIn, upload.single('image'), serviceController.uploadImage);
router.delete('/images/:id',isLoggedIn, serviceController.deleteImage);





// Sales Page Routes
router.get('/staffSale', serviceController.newServicePage);
router.post('/staffSale',  serviceController.CreateService);
router.get('/staffSale/transactions',  serviceController.getSalesSummary);


module.exports = router;
