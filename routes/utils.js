
 var utils ={}
utils.filterData = function (req){
    var data = {}
    if(req.body.title) data.title = req.body.title;
    if(req.body.category) data.category = req.body.category
    if(req.body.subcategory) data.subcategory = req.body.subcategory
    if(req.body.description) data.description = req.body.description
    if(req.body.openingHours) data.openingHours = req.body.openingHours
    if(req.body.packageOption) data.packageOption = req.body.packageOption
    if(req.body.city) data.city = req.body.city
    if(req.body.location) data.location = req.body.location
    if(req.body.activityInfo) data.activityInfo = req.body.activityInfo
    if(req.body.openDate) data.openDate = req.body.openDate
    if(req.body.cancellation ===true||req.body.cancellation===false) data.cancellation = req.body.cancellation
    if(req.body.duration===true||req.body.duration===false) data.duration = req.body.duration
    if(req.body.voucher===true||req.body.voucher===false) data.voucher = req.body.voucher
    if(req.body.voucher2=== false || req.body.voucher2===true ) data.voucher2 = req.body.voucher2
    if(req.body.additionalInfo ) data.additionalInfo = req.body.additionalInfo
    if(req.body.wte) data.wte = req.body.wte
    return data
  }
  utils.completed = function(attraction){
    var completed = false;
    if(attraction.title &&
    attraction.category &&
    attraction.subcategory &&
    attraction.description &&
    attraction.openingHours &&
    attraction.packageOption &&
    attraction.city &&
    attraction.location &&
    attraction.activityInfo &&
    (attraction.openDate ===true||attraction.openDate===false) &&
    (attraction.cancellation ===true||attraction.cancellation===false) &&
    (attraction.duration===true||attraction.duration===false)  &&
    (attraction.voucher===true||attraction.voucher===false) &&
    (attraction.voucher2=== false || attraction.voucher2===true ) &&
    attraction.additionalInfo &&
    attraction.wte) completed = true;
    return completed
  }

  module.exports = utils